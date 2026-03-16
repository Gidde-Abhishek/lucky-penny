## Architecture
- /apps/ — Django applications (each with models, views, urls, tests)
- /config/ or /project/ — Django project settings
- /templates/ — HTML templates
- /static/ — Static files (CSS, JS, images)
- /media/ — User-uploaded files

## Code Conventions
- Fat models, thin views — business logic belongs in models or service layers
- Use class-based views for CRUD operations
- Use function-based views for simple, one-off endpoints
- Django REST Framework serializers for API data validation

## Build & Validation
- Run: `python manage.py runserver`
- Test all: `python manage.py test`
- Test single: `python manage.py test apps.appname.tests.TestClassName.test_method`
- Migrations: `python manage.py makemigrations && python manage.py migrate`
- Shell: `python manage.py shell_plus`

## Rules
- ALWAYS create and run migrations after model changes
- NEVER write raw SQL — use Django ORM querysets
- ALWAYS use Django's built-in auth system, never roll your own
- NEVER store sensitive settings in settings.py — use environment variables
- ALWAYS use select_related/prefetch_related for related object queries (N+1 prevention)
- ALWAYS use Django's CSRF protection — never disable it

## Common Pitfalls
- N+1 queries from accessing related objects in loops without prefetch
- Not running makemigrations after model changes
- Circular imports between apps (use string references in ForeignKey)
- Using settings.DEBUG in production-critical logic
