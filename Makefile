.PHONY: wheel fmt update-deps

fmt:
	black .
	yarn run eslint . --fix

update-deps:
	poetry update
	yarn upgrade

wheel:
	pip wheel . --no-deps -w wheel
