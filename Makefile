start-server:
	cd server && npm run dev

start-client:
	cd client && npm run dev

start-all:
	make start-server & make start-client

stop-all:
	make stop-server & make stop-client
