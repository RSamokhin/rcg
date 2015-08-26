/*
 Navicat Premium Data Transfer

 Source Server         : RCG
 Source Server Type    : SQL Server
 Source Server Version : 12000201
 Source Host           : 191.237.232.75
 Source Database       : rcg
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 12000201
 File Encoding         : utf-8

 Date: 08/24/2015 18:17:23 PM
*/

-- ----------------------------
--  Table structure for [dbo].[vacancy]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[vacancy]') AND type IN ('U'))
	DROP TABLE [dbo].[vacancy]
GO
CREATE TABLE [dbo].[vacancy] (
	[news_id] int NOT NULL,
	[is_male] int NULL DEFAULT ((0)),
	[work_time] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[end_time] datetime2(0) NULL,
	[money] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[city] varchar(50) COLLATE Cyrillic_General_CI_AS NULL
)
GO

-- ----------------------------
--  Table structure for [dbo].[feedbacks]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[feedbacks]') AND type IN ('U'))
	DROP TABLE [dbo].[feedbacks]
GO
CREATE TABLE [dbo].[feedbacks] (
	[id] int IDENTITY(1,1) NOT NULL,
	[name] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[email] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[phone] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[text] varchar(500) COLLATE Cyrillic_General_CI_AS NULL,
	[status] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[reply_comment] int NULL DEFAULT NULL,
	CONSTRAINT [PK__feedback__3213E83FEFD8B288] PRIMARY KEY CLUSTERED ([id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[users]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[users]') AND type IN ('U'))
	DROP TABLE [dbo].[users]
GO
CREATE TABLE [dbo].[users] (
	[phone] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[email] varchar(max) COLLATE Cyrillic_General_CI_AS NULL,
	[fname] varchar(max) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[lname] varchar(max) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[pwdhash] varchar(max) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[user_status_id] int NOT NULL,
	[birthdate] datetime2(0) NULL,
	[ismale] int NULL,
	[active_confirmation_code] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[town] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[user_Info] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[bonuses] int NULL,
	CONSTRAINT [PK__users__2633A3211F82EE01] PRIMARY KEY CLUSTERED ([phone]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[sessions]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[sessions]') AND type IN ('U'))
	DROP TABLE [dbo].[sessions]
GO
CREATE TABLE [dbo].[sessions] (
	[id] int NOT NULL,
	[user] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[begindate] datetime2(0) NOT NULL,
	[enddate] datetime2(0) NULL,
	[deviceinfo] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[hash] varchar(1) COLLATE Cyrillic_General_CI_AS NOT NULL,
	CONSTRAINT [PK__sessions__3213E83F89E3E41A] PRIMARY KEY CLUSTERED ([id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[user_status]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[user_status]') AND type IN ('U'))
	DROP TABLE [dbo].[user_status]
GO
CREATE TABLE [dbo].[user_status] (
	[status] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[status_id] int NOT NULL,
	[need_confimation] int NOT NULL,
	CONSTRAINT [PK__user_sta__3683B531ED0E6B11] PRIMARY KEY CLUSTERED ([status_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[status_history]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[status_history]') AND type IN ('U'))
	DROP TABLE [dbo].[status_history]
GO
CREATE TABLE [dbo].[status_history] (
	[user] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[status_id] int NOT NULL,
	[date] datetime2(0) NOT NULL,
	[info] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[history_id] int NOT NULL,
	CONSTRAINT [PK__status_h__096AA2E97B9D8803] PRIMARY KEY CLUSTERED ([history_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[news]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[news]') AND type IN ('U'))
	DROP TABLE [dbo].[news]
GO
CREATE TABLE [dbo].[news] (
	[n_id] int NOT NULL,
	[author_id] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[is_draft] bit NOT NULL DEFAULT ((1)),
	[datecreated] datetime2(0) NOT NULL,
	[datepubliched] datetime2(0) NOT NULL,
	[title] text COLLATE Cyrillic_General_CI_AS NULL,
	[text] text COLLATE Cyrillic_General_CI_AS NULL,
	[status_id] int NULL,
	[short_text] text COLLATE Cyrillic_General_CI_AS NULL,
	[is_vacancy] bit NULL DEFAULT ((0)),
	[category_id] int NULL,
	[rights_json] text COLLATE Cyrillic_General_CI_AS NULL,
	[is_project] bit NULL DEFAULT ((0)),
	[picture] text COLLATE Cyrillic_General_CI_AS NULL,
	[preview_picture] text COLLATE Cyrillic_General_CI_AS NULL,
	CONSTRAINT [PK__news__7371E14E52300B17] PRIMARY KEY CLUSTERED ([n_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[news_status]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[news_status]') AND type IN ('U'))
	DROP TABLE [dbo].[news_status]
GO
CREATE TABLE [dbo].[news_status] (
	[status_id] int NOT NULL,
	[status] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[aloowed_groups_json] text COLLATE Cyrillic_General_CI_AS NULL,
	CONSTRAINT [PK__news_sta__3683B531AA9D3DBB] PRIMARY KEY CLUSTERED ([status_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[news_history]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[news_history]') AND type IN ('U'))
	DROP TABLE [dbo].[news_history]
GO
CREATE TABLE [dbo].[news_history] (
	[change_id] int NOT NULL,
	[news_id] int NOT NULL,
	[change_json] text COLLATE Cyrillic_General_CI_AS NOT NULL,
	CONSTRAINT [PK__news_his__F4EFE5961F54EE09] PRIMARY KEY CLUSTERED ([change_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[messages]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[messages]') AND type IN ('U'))
	DROP TABLE [dbo].[messages]
GO
CREATE TABLE [dbo].[messages] (
	[message_id] int NOT NULL,
	[message_topic] text COLLATE Cyrillic_General_CI_AS NULL,
	[sender_id] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[message_type] varchar(1) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[message_status] varchar(1) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[message_text] text COLLATE Cyrillic_General_CI_AS NULL,
	[date_created] datetime2(0) NOT NULL,
	[date_send] datetime2(0) NOT NULL,
	CONSTRAINT [PK__messages__0BBF6EE6D15A8CBD] PRIMARY KEY CLUSTERED ([message_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[messages_rspt]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[messages_rspt]') AND type IN ('U'))
	DROP TABLE [dbo].[messages_rspt]
GO
CREATE TABLE [dbo].[messages_rspt] (
	[message_id] int NOT NULL,
	[rcpt_id] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	CONSTRAINT [PK__messages__9EBE2AA0685DF585] PRIMARY KEY CLUSTERED ([message_id],[rcpt_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[news_category]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[news_category]') AND type IN ('U'))
	DROP TABLE [dbo].[news_category]
GO
CREATE TABLE [dbo].[news_category] (
	[category_id] int NOT NULL,
	[category_name] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[is_shown] int NULL,
	CONSTRAINT [PK__news_cat__D54EE9B453D9396A] PRIMARY KEY CLUSTERED ([category_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[news_comments]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[news_comments]') AND type IN ('U'))
	DROP TABLE [dbo].[news_comments]
GO
CREATE TABLE [dbo].[news_comments] (
	[comment_id] int NOT NULL,
	[user_id] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[news_id] int NOT NULL,
	[comment_text] text COLLATE Cyrillic_General_CI_AS NULL,
	[timestamp] datetime2(0) NOT NULL,
	[reply_comment_id] int NULL,
	[comment_type] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[comment_status] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[admin_comment] text COLLATE Cyrillic_General_CI_AS NULL,
	CONSTRAINT [PK__news_com__E7957687846BC0BC] PRIMARY KEY CLUSTERED ([comment_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[news_photo]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[news_photo]') AND type IN ('U'))
	DROP TABLE [dbo].[news_photo]
GO
CREATE TABLE [dbo].[news_photo] (
	[photo_id] int NOT NULL,
	[news_id] int NOT NULL,
	[file_name] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[photo_owner] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[photo_title] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[photo_description] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[photo_approved] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	CONSTRAINT [PK__news_pho__CB48C83DC87A308B] PRIMARY KEY CLUSTERED ([photo_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[user_news_status]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[user_news_status]') AND type IN ('U'))
	DROP TABLE [dbo].[user_news_status]
GO
CREATE TABLE [dbo].[user_news_status] (
	[user_id] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[news_id] int NOT NULL,
	[status] varchar(1) COLLATE Cyrillic_General_CI_AS NOT NULL
)
GO

-- ----------------------------
--  Table structure for [dbo].[bonuses_moves]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[bonuses_moves]') AND type IN ('U'))
	DROP TABLE [dbo].[bonuses_moves]
GO
CREATE TABLE [dbo].[bonuses_moves] (
	[income_id] int NOT NULL,
	[user_id] varchar(50) COLLATE Cyrillic_General_CI_AS NOT NULL,
	[count] int NOT NULL,
	[timestamp] datetime2(0) NOT NULL,
	[info_json] text COLLATE Cyrillic_General_CI_AS NULL,
	CONSTRAINT [PK__bonuses___8DC777A6E1C6D960] PRIMARY KEY CLUSTERED ([income_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[prizes]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[prizes]') AND type IN ('U'))
	DROP TABLE [dbo].[prizes]
GO
CREATE TABLE [dbo].[prizes] (
	[prize_id] int NOT NULL,
	[prize_title] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[prize_description] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[price] int NULL,
	[count] int NULL,
	CONSTRAINT [PK__prizes__6EC2CFD9C94EC58B] PRIMARY KEY CLUSTERED ([prize_id]) 
	WITH (IGNORE_DUP_KEY = OFF)
)
GO

-- ----------------------------
--  Table structure for [dbo].[user_prize_tranzaction]
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID('[dbo].[user_prize_tranzaction]') AND type IN ('U'))
	DROP TABLE [dbo].[user_prize_tranzaction]
GO
CREATE TABLE [dbo].[user_prize_tranzaction] (
	[prize_id] int NULL,
	[user_id] varchar(50) COLLATE Cyrillic_General_CI_AS NULL,
	[status] varchar(1) COLLATE Cyrillic_General_CI_AS NULL,
	[timestamp] datetime2(0) NULL,
	[info_json] text COLLATE Cyrillic_General_CI_AS NULL
)
GO

