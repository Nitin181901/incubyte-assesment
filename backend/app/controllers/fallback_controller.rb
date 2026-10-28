# Serves the Vite SPA shell for non-API browser navigations.
class FallbackController < ActionController::Base
  def index
    file = Rails.public_path.join("index.html")
    if File.exist?(file)
      send_file file, type: "text/html; charset=utf-8", disposition: "inline"
    else
      render plain: "Frontend not built. Run: cd frontend && npm run build:rails", status: :service_unavailable
    end
  end
end
