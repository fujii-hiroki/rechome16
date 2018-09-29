Rails.application.routes.draw do
  root 'top#index'

  get  'login', to: 'login#index'
  post 'login/login', to: 'login#login'

  get  'date', to: 'date#index'

  get  'lasttime', to: 'lasttime#index'
  post 'lasttime/create', to: 'lasttime#create'
  get  'lasttime/delete/:id', to: 'lasttime#delete'
  post 'lasttime/update', to: 'lasttime#done'
end
