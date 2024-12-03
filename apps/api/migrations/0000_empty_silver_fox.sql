CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`rkey` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`ingredients` text NOT NULL,
	`steps` text NOT NULL,
	`created_at` text NOT NULL,
	`author_did` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_id_unique` ON `recipes` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_rkey_author_did_unique` ON `recipes` (`rkey`,`author_did`);