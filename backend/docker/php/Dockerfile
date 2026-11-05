# Imaginea pentru containerul daw-php: PHP 8.5 (FPM) + extensiile necesare pentru Symfony
FROM php:8.5-fpm

# Programe utile in container (git, unzip, nano) + bibliotecile pentru extensiile PHP
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        unzip \
        curl \
        nano \
        libpq-dev \
        libicu-dev \
        libzip-dev \
    && docker-php-ext-install pdo_pgsql intl zip \
    && rm -rf /var/lib/apt/lists/*

# Composer (managerul de pachete PHP), copiat din imaginea oficiala
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Setarile PHP pentru dezvoltare (fus orar, limite, afisarea erorilor)
COPY php.ini /usr/local/etc/php/conf.d/daw.ini

# Doar pentru dezvoltare: PHP-FPM ruleaza cu acelasi utilizator ca terminalul din container,
# ca sa nu apara erori de permisiuni la folderul var/ (cache, loguri)
RUN printf '[www]\nuser = root\ngroup = root\n' > /usr/local/etc/php-fpm.d/zz-daw.conf \
    && git config --global --add safe.directory '*'

WORKDIR /var/www/app

CMD ["php-fpm", "--allow-to-run-as-root"]
