### DEV

build-dev:
	cd shelly-fm-fe && $(MAKE) build
	cd shelly-fm-be && $(MAKE) build
	docker-compose -f docker-compose-dev.yml up


run-dev:
	docker-compose -f docker-compose-dev.yml up

# ### LOCAL (prod config)

# build-local:
# 	cd shelly-fm-fe && $(MAKE) build-local
# 	cd shelly-fm-be && $(MAKE) build

# run-local:
# 	ENV=local docker-compose -f docker-compose-production.yml up
		

# ### PROD

# build-production:
# 	cd shelly-fm-fe && $(MAKE) build-production
# 	cd shelly-fm-be && $(MAKE) build	

# run-production:
# 	ENV=production docker-compose -f docker-compose-production.yml up
