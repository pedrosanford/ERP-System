# Fix: HR Stats Endpoint Error

## Проблема

На Dashboard появлялась ошибка "Failed to fetch" при попытке загрузить данные с HR сервиса.

## Причина

HR Controller использовал `@RequestMapping("/api/hr")`, но Gateway с настройкой `StripPrefix=1` удалял `/api` из пути, превращая запрос `/api/hr/stats` в `/hr/stats`. В результате backend не мог найти endpoint.

## Решение

### 1. Исправлен HR Controller

Изменен `@RequestMapping` с `/api/hr` на `/hr`:

```java
@RestController
@RequestMapping("/hr")  // было: /api/hr
@CrossOrigin(origins = "*")
public class HrController {
    // ...
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getHrStats() {
        return ResponseEntity.ok(hrStatsService.getHrStats());
    }
}
```

### 2. Обновлен hrService.ts

Исправлен default API URL на Gateway:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'; // Gateway URL
```

Было: `'http://localhost:8082'` (прямое обращение к HR service)

## Как работает маршрутизация

1. **Frontend** → `http://localhost:8080/api/hr/stats`
2. **Gateway** → удаляет `/api` (StripPrefix=1)
3. **HR Service** → получает запрос на `/hr/stats`
4. **Controller** → `@RequestMapping("/hr")` + `@GetMapping("/stats")` = `/hr/stats` ✅

## Тестирование

```bash
# Проверка endpoint через Gateway
curl http://localhost:8080/api/hr/stats

# Ожидаемый ответ:
{
  "totalStaff": 1,
  "activeStaff": 1,
  "newHires": 0,
  "departments": 1,
  "averageSalary": 120000.00,
  "pendingLeaveRequests": 0,
  "pendingPayrolls": 0
}
```

## Применение

1. Пересобран Docker образ HR service:
   ```bash
   docker-compose stop edusync-hr
   docker-compose build edusync-hr
   docker-compose up edusync-hr -d
   ```

2. Frontend автоматически подхватит изменения при горячей перезагрузке

## Результат

✅ Dashboard загружается без ошибок  
✅ HR Stats endpoint работает корректно  
✅ Student Stats endpoint работает корректно  
✅ Все запросы маршрутизируются через Gateway  

---

**Дата исправления:** 2025-10-05  
**Статус:** ✅ Исправлено и протестировано

