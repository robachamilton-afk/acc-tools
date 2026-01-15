CREATE TABLE `assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_id` int NOT NULL,
	`asset_id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`type` varchar(100),
	`location` varchar(255),
	`quantity` int DEFAULT 1,
	`specifications` text,
	`confidence` int NOT NULL,
	`source_document` text NOT NULL,
	`source_document_path` text,
	`extracted_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `document_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_id` int NOT NULL,
	`filename` text NOT NULL,
	`path` text NOT NULL,
	`is_asset_relevant` int NOT NULL,
	`asset_types` text,
	`reviewed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `extraction_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`project_name` varchar(255) NOT NULL,
	`rclone_path` text NOT NULL,
	`status` enum('pending','reviewing','extracting','completed','failed') NOT NULL DEFAULT 'pending',
	`total_documents` int DEFAULT 0,
	`reviewed_documents` int DEFAULT 0,
	`extracted_documents` int DEFAULT 0,
	`total_assets` int DEFAULT 0,
	`started_at` timestamp,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extraction_jobs_id` PRIMARY KEY(`id`)
);
