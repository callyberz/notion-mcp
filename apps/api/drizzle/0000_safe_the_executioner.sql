CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`purchase_deadline` text,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `item_statuses` (
	`item_id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`updated_at` text DEFAULT '(datetime(''now''))',
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`price` real,
	`image_url` text,
	`is_preferred` integer DEFAULT 0,
	`notes` text,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
