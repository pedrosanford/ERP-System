# 🚀 Настройка EduSync ERP System для коллег

## 📋 Что нужно сделать после получения обновлений

### 1. **Обновите код из репозитория**
```bash
git pull origin main
```

### 2. **Убедитесь, что Docker запущен**
```bash
docker --version
# Если Docker не установлен, установите его с https://docker.com
```

### 3. **Запустите систему**
```bash
# Простой способ - используйте готовый скрипт
./start-auth-system.sh

# Или запустите вручную:
docker-compose up -d
```

### 4. **Запустите frontend**
```bash
cd frontend/edusync-web
npm install
npm run dev
```

## 🌐 Доступные URL

- **Frontend:** http://localhost:5173
- **Auth Service:** http://localhost:8086
- **API Gateway:** http://localhost:8080
- **Eureka Dashboard:** http://localhost:8761

## 🧪 Тестирование

### 1. **Откройте http://localhost:5173**
### 2. **Попробуйте зарегистрироваться:**
- Нажмите "Sign Up"
- Заполните форму с новым email
- Нажмите "Create account"

### 3. **Попробуйте войти:**
- Нажмите "Sign In"
- Введите email и пароль
- Нажмите "Sign in"

## 🔧 Если что-то не работает

### Проверьте статус сервисов:
```bash
docker-compose ps
```

### Проверьте логи auth service:
```bash
docker-compose logs edusync-auth
```

### Перезапустите frontend:
```bash
cd frontend/edusync-web
npm run dev
```

### Очистите кэш браузера:
- Нажмите Ctrl+Shift+R (принудительное обновление)
- Или откройте в режиме инкогнито

## 🆘 Если проблемы остаются

### 1. **Полная перезагрузка системы:**
```bash
docker-compose down
docker-compose up -d
```

### 2. **Проверьте, что все порты свободны:**
```bash
# Проверьте, что порты 5173, 8086, 8080, 8761 свободны
netstat -an | grep -E "(5173|8086|8080|8761)"
```

### 3. **Очистите Docker кэш:**
```bash
docker system prune -f
docker-compose up -d
```

## 📝 Важные изменения

### ✅ Что было добавлено:
- **Auth Service** - новый микросервис для аутентификации
- **PostgreSQL интеграция** - база данных для пользователей
- **JWT токены** - безопасная аутентификация
- **Красивый UI** - современный дизайн auth страницы
- **CORS настройки** - правильная работа frontend ↔ backend

### 🔧 Технические детали:
- Auth service работает на порту 8086
- Frontend использует `import.meta.env.VITE_API_URL` (не `process.env`)
- Все сервисы интегрированы через Docker Compose
- База данных создается автоматически

## 🎯 Ожидаемый результат

После настройки у вас должно работать:
- ✅ Красивая auth страница с логотипом
- ✅ Успешная регистрация пользователей
- ✅ Успешный вход в систему
- ✅ JWT токены сохраняются в localStorage
- ✅ Переход на dashboard после входа

## 📞 Поддержка

Если что-то не работает, проверьте:
1. Все сервисы запущены (`docker-compose ps`)
2. Frontend работает (http://localhost:5173)
3. Нет ошибок в консоли браузера (F12)
4. Кэш браузера очищен

**Система готова к использованию!** 🚀
