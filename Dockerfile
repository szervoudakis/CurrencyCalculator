FROM php:8.3-fpm

# installations basic dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libicu-dev \
    libpq-dev \
    libxml2-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_mysql intl zip gd opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Working
WORKDIR /var/www/html

# Αντιγραφή project αρχείων (μόνο αν δεν γίνεται mount με volume)
# COPY ./app /var/www/html

# Κατά προτίμηση: διατήρηση permissions
RUN chown -R www-data:www-data /var/www/html

CMD ["php-fpm"]
