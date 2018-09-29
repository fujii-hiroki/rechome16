class LoginController < ApplicationController

  skip_before_action :require_sign_in!, only: [:index, :login]

  def index
  end

  def login
    name = params[:name]
    pw = params[:pw]

    u = User.where(:name => name).first

    # ユーザ名が存在しない場合は終了
    unless u
      render json: {}
      return
    end

    # パスワードのリセット
    u = reset_password(u, pw) if u.reset_password

    if u && u.authenticate(pw)
      sign_in(u)
      #redirect_to root_path
      render json: {url: "/lasttime"}
    else
      #redirect_to "/login"
      render json: {url: "/login"}
    end
  end

  private

  def reset_password(u, pw)
    u.password = pw
    u.reset_password = false
    u.save!
    u
  end

  def sign_in(user)
    remember_token = User.new_remember_token
    cookies.permanent[:user_remember_token] = remember_token
    user.update!(remember_token: User.encrypt(remember_token))
    @current_user = user
  end
end
