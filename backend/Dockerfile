FROM ruby:3.2.8
LABEL description="AceUp Tech assessment backend docker image"
LABEL version="1.0"
LABEL mantainer="Alejandro Gurovich <alex@rocket-house.com>"

# Install essential dependencies
RUN apt-get update -qq && \
    apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    postgresql-client

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Copy .env file if it exists
COPY .env* ./

# Install gems
RUN bundle install

# Install foreman
RUN gem install foreman

EXPOSE 3000