

CREATE UNIQUE INDEX unique_enabled_cart_per_user
ON "Cart" ("userId")
WHERE state = 'ENABLED';

