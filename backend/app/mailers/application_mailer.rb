class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('MAILGUN_FROM_EMAIL', "noreply@#{ENV.fetch('MAILGUN_DOMAIN', 'example.com')}")
  layout "mailer"
end
