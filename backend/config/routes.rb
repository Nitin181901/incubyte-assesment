Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :backend do
    namespace :v1 do
      resource :session, only: [ :create ]
      get "me", to: "me#show"

      resources :employees do
        resources :salary_changes, only: [ :index ]
      end

      get "meta/filters", to: "meta#filters"

      resources :countries, param: :code, only: [ :index, :update ]

      get "stats/summary", to: "stats#summary"
      get "stats/breakdown", to: "stats#breakdown"
      get "stats/distribution", to: "stats#distribution"
      get "stats/tenure", to: "stats#tenure"
      get "stats/outliers", to: "stats#outliers"
    end
  end

  # SPA fallback: non-API GETs serve the Vite build from public/index.html.
  get "*path", to: "fallback#index", constraints: ->(req) {
    !req.path.start_with?("/backend", "/up", "/rails")
  }
  root "fallback#index"
end

