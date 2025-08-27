---
title: БД
---

Ниже представлена схема базы данных и подробные описания сущностей и их полей.

### Диаграмма сущностей (ER)

```mermaid
erDiagram
    MERCHANT_GROUPS {
        UUID uuid PK
        VARCHAR(255) name
    }
    MERCHANTS {
        UUID uuid PK
        TEXT name
        UUID merchant_group_id FK
        DECIMAL balance
        DECIMAL frozen_balance
        FLOAT percent_payin
        FLOAT percent_payout
        INTEGER order_ttl_sec
        VARCHAR(255) url_callback
        VARCHAR(255) telegram_id
        UUID cognito_sub
    }
    TRADERS {
        UUID uuid PK
        DECIMAL balance
        DECIMAL frozen_balance
        BOOLEAN is_blocked
        INTEGER priority
        DECIMAL safety_deposit
        VARCHAR(255) telegram_id
        UUID cognito_sub
    }
    TRADER_PERCENTS {
        UUID uuid PK
        UUID trader_id FK
        UUID merchant_group_id FK
        FLOAT percent
        VARCHAR(50) status
        VARCHAR(50) requisite_type
    }
    BANKS {
        UUID uuid PK
        VARCHAR(50) code UNIQUE
        VARCHAR(256) name_ru
        BOOLEAN is_active
    }
    REQUISITES {
        UUID uuid PK
        VARCHAR(255) requisites
        VARCHAR(50) bank_code FK->BANKS.code
        VARCHAR(50) type
        VARCHAR(255) owner_full_name
        UUID trader_id FK
        VARCHAR(50) currency
        DECIMAL upper_sum_limit
        DECIMAL down_sum_limit
        VARCHAR(50) status
        BOOLEAN is_blocked
        INT simultaneous_orders_num
        TIMESTAMP created_at
    }
    REQUISITE_VOLUME_LIMITS {
        UUID uuid PK
        UUID requisite_id FK
        INT days
        DECIMAL max_limit
        DECIMAL cur_limit
        TIMESTAMP init_time
        TIMESTAMP update_time
    }
    ORDERS {
        UUID uuid PK
        UUID trader_id FK
        UUID merchant_id FK
        UUID requisite_id FK
        VARCHAR(255) type
        VARCHAR(255) status
        DECIMAL exchange_rate
        DECIMAL amount_rub
        DECIMAL amount_usdt
        VARCHAR(255) receipt
        DECIMAL trader_reward
        DECIMAL merchant_commission
        INTEGER ttl_sec
        UUID uuid_callback
        BOOLEAN confirmed_by_customer
        VARCHAR(255) url_callback
        TIMESTAMP created_at
        TIMESTAMP modified_at
    }
    BALANCE_HISTORY {
        UUID uuid PK
        UUID trader_id FK
        UUID merchant_id FK
        UUID order_id FK
        TEXT type
        VARCHAR(50) currency
        DECIMAL amount
        DECIMAL balance_before
        DECIMAL balance_after
        TIMESTAMP created_at
    }
    API_KEYS {
        UUID uuid PK
        UUID merchant_id FK
        TEXT key
        TEXT secret
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    TEAM_LEADS {
        UUID uuid PK
        DECIMAL balance
        VARCHAR(255) email
        VARCHAR(50) status
        UUID cognito_sub
        TIMESTAMP created_at
        TIMESTAMP modified_at
    }
    TEAMLEAD_HIERARCHY {
        UUID parent_id FK
        UUID child_id PK FK
    }
    TEAMLEAD_PERCENTS {
        UUID uuid PK
        UUID team_lead_id FK
        UUID trader_percent_id FK
        FLOAT percent
        VARCHAR(50) status
        INT level
    }
    TEAMLEAD_ORDER_REWARDS {
        UUID uuid PK
        UUID order_id FK
        UUID team_lead_id FK
        UUID teamlead_percent_id FK
        FLOAT percent
        DECIMAL reward
        INT level
        TIMESTAMP created_at
    }
    DEVICES {
        BIGINT id PK
        VARCHAR(255) name
        TEXT qrcode_url
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    BANK_NOTIFICATIONS {
        UUID uuid PK
        UUID bank_uuid FK
        TEXT original_message
        TEXT pattern UNIQUE(bank_uuid,pattern)
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    PERCENT_RATES {
        UUID uuid PK
        DECIMAL(10,3) tier_1
        DECIMAL(10,3) tier_2
        DECIMAL(10,3) tier_3
        DECIMAL(10,3) tier_4
    }
    CURRENCY_TIER_CONFIGS {
        UUID uuid PK
        VARCHAR(10) currency UNIQUE
        DECIMAL(15,3) tier_1_2_boundary
        DECIMAL(15,3) tier_2_3_boundary
        DECIMAL(15,3) tier_3_4_boundary
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    COUNTRIES {
        UUID uuid PK
        VARCHAR(50) code UNIQUE
        VARCHAR(256) name_ru
    }
    DISPUTES {
        UUID uuid PK
        VARCHAR(50) initiator
        VARCHAR(50) reason
        DECIMAL amount
        UUID order_id FK
        VARCHAR(50) status
        INTEGER ttl_sec
        TIMESTAMP created_at
        TIMESTAMP modified_at
    }
    DISPUTE_EVIDENCE {
        UUID uuid PK
        VARCHAR(50) uploader
        UUID uploader_id
        UUID dispute_id FK
        TEXT key
        TIMESTAMP created_at
    }
    DISPUTE_LOGS {
        UUID uuid PK
        UUID dispute_id FK
        UUID actor_id
        TEXT actor_role
        VARCHAR(50) status
        TEXT details
        TIMESTAMP created_at
    }
    TELEGRAM_USERS {
        UUID uuid PK
        UUID trader_id FK
        BOOLEAN active
        VARCHAR(32) phone
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    MERCHANT_GROUPS ||--o{ MERCHANTS : contains
    TRADERS ||--o{ TRADER_PERCENTS : has
    MERCHANT_GROUPS ||--o{ TRADER_PERCENTS : config_for
    BANKS ||--o{ REQUISITES : has
    TRADERS ||--o{ REQUISITES : owns
    REQUISITES ||--o{ REQUISITE_VOLUME_LIMITS : limits
    TRADERS ||--o{ ORDERS : places
    MERCHANTS ||--o{ ORDERS : receives
    REQUISITES ||--o{ ORDERS : uses
    TRADERS ||--o{ BALANCE_HISTORY : changes
    MERCHANTS ||--o{ BALANCE_HISTORY : changes
    ORDERS ||--o{ BALANCE_HISTORY : references
    MERCHANTS ||--o{ API_KEYS : has
    TEAM_LEADS ||--o{ TEAMLEAD_PERCENTS : sets
    TRADER_PERCENTS ||--o{ TEAMLEAD_PERCENTS : maps
    TEAM_LEADS ||--o{ TEAMLEAD_HIERARCHY : parents
    TEAM_LEADS ||--o{ TEAMLEAD_HIERARCHY : children
    TEAM_LEADS ||--o{ TEAMLEAD_ORDER_REWARDS : earns
    ORDERS ||--o{ TEAMLEAD_ORDER_REWARDS : rewards
    TEAMLEAD_PERCENTS ||--o{ TEAMLEAD_ORDER_REWARDS : by_percent
    BANKS ||--o{ BANK_NOTIFICATIONS : patterns
    ORDERS ||--o{ DISPUTES : has
    DISPUTES ||--o{ DISPUTE_EVIDENCE : evidence
    DISPUTES ||--o{ DISPUTE_LOGS : logs
    TRADERS ||--o{ TELEGRAM_USERS : link
```

### Описание таблиц и полей

(См. полное описание полей в предыдущей версии; при необходимости вынесу в отдельные под‑страницы.)