class OrderMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.order_mailer.confirmation_email.subject
  #
  def confirmation_email(order)
    @order = order
    @order_items = order.order_items
    
    mail(
      to: @order.customer_email,
      subject: "Order Confirmation ##{@order.id}"
    )
  end
end
