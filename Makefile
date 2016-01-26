prefix=/usr/local
BINS = $(wildcard bin/18f-*)

default: install

install:
		@echo "Installing 18F command"
		@install -d -m 0755 $(prefix)/bin;
		@install -m 0755 18f $(prefix)/bin;
		@$(foreach cmd,$(BINS), \
				echo "Installing $(subst bin/,,$(cmd)) subcommand"; \
				install -m 0755 $(cmd) $(prefix)/bin; \
		)

clean:
		@echo "Removing 18f command"
		@rm $(prefix)/bin/18f
		@echo "Removing subcommands"
		@$(foreach cmd,$(BINS), \
				rm $(prefix)/$(cmd); \
		)
