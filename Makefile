.PHONY: setup test lint rubocop eslint dev seed

setup:
	cd backend && bundle install
	cd frontend && npm install
	cd backend && bin/rails db:prepare db:seed

test:
	cd backend && bin/rails test
	cd frontend && npm test -- --run

lint: rubocop eslint

rubocop:
	cd backend && bundle exec rubocop

eslint:
	cd frontend && npm run lint

dev:
	@echo "Start API:  cd backend && bin/rails s"
	@echo "Start SPA:  cd frontend && npm run dev"
	@echo "Or run both terminals; SPA proxies /backend to :3000"

seed:
	cd backend && RESEED=1 bin/rails db:seed
