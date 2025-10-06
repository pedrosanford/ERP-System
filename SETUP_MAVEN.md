# Maven Installation Guide (Optional)

## Текущий статус
✅ **Вам НЕ нужен Maven для запуска проекта!**  
HR сервис успешно работает через Docker.

## Когда нужен Maven?
Maven нужен только если вы хотите:
- Запускать сервисы локально (без Docker)
- Разрабатывать и дебажить код локально

## Установка Maven на macOS

### Вариант 1: Homebrew (Рекомендуется)
```bash
# Установите Homebrew (если еще не установлен)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установите Maven
brew install maven

# Проверьте установку
mvn --version
```

### Вариант 2: Manual Installation
```bash
# Скачайте Maven
cd /tmp
curl -O https://dlcdn.apache.org/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.tar.gz

# Распакуйте
tar -xzf apache-maven-3.9.5-bin.tar.gz
sudo mv apache-maven-3.9.5 /opt/

# Добавьте в PATH
echo 'export PATH="/opt/apache-maven-3.9.5/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Проверьте
mvn --version
```

## Запуск без Maven (через Docker)

### Команды для работы с HR сервисом:

#### 1. Запустить PostgreSQL
```bash
cd /Users/stam7/Documents/Coding\ Workspace/ERP/ERP-System
docker-compose up postgres -d
```

#### 2. Пересобрать и запустить HR сервис
```bash
# Остановить и удалить старый контейнер
docker-compose stop edusync-hr
docker-compose rm -f edusync-hr

# Пересобрать образ с новым кодом
docker-compose build edusync-hr

# Запустить новый контейнер
docker-compose up edusync-hr -d
```

#### 3. Проверить логи
```bash
docker logs erp-system-edusync-hr-1 -f
```

#### 4. Проверить API
```bash
curl http://localhost:8082/api/hr/health
curl http://localhost:8082/api/hr/stats
```

#### 5. Проверить базу данных
```bash
docker exec erp-system-postgres-1 psql -U edusync -d edusync_erp -c "\dt"
```

## Полезные Docker команды

```bash
# Остановить все контейнеры
docker-compose down

# Запустить все сервисы
docker-compose up -d

# Посмотреть запущенные контейнеры
docker ps

# Посмотреть логи конкретного сервиса
docker logs erp-system-edusync-hr-1

# Зайти в контейнер PostgreSQL
docker exec -it erp-system-postgres-1 psql -U edusync -d edusync_erp

# Очистить все (внимание: удалит данные!)
docker-compose down -v
```

---

**Рекомендация**: Используйте Docker для разработки - это проще и надежнее!

