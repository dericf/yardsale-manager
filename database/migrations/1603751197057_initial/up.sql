CREATE TABLE public."user" (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    first_name text,
    last_name text,
    confirmation_key text,
    has_confirmed boolean DEFAULT false NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    token_version integer DEFAULT 0 NOT NULL,
    name text,
    initials text,
    password_reset_code text,
    has_completed_onboarding boolean DEFAULT false NOT NULL
);
CREATE TABLE public.address (
    address_id integer NOT NULL,
    street1 text NOT NULL,
    street2 text NOT NULL,
    city text NOT NULL,
    province text NOT NULL,
    postal text NOT NULL,
    country text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id text
);
CREATE TABLE public.seller (
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    initials text,
    email text,
    phone text,
    address_text text,
    notes text,
    user_uuid uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    company text,
    is_user_link boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL
);
CREATE TABLE public.transaction (
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    yardsale_uuid uuid NOT NULL,
    seller_uuid uuid,
    user_uuid uuid NOT NULL,
    description text NOT NULL,
    price money NOT NULL
);
CREATE TABLE public.yardsale (
    name text NOT NULL,
    address_id integer,
    start_date date,
    end_date date,
    days_of_week text,
    start_time time with time zone,
    end_time time with time zone,
    user_uuid uuid NOT NULL,
    address_text text,
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email text,
    phone text,
    notes text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    company text,
    pos_lat2 text,
    pos_lng double precision,
    is_public boolean DEFAULT false NOT NULL,
    pos_lat double precision,
    hours_open time with time zone,
    hours_close time with time zone,
    has_completed_onboarding boolean DEFAULT false NOT NULL
);
CREATE TABLE public.yardsale_seller_link (
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    seller_uuid uuid NOT NULL,
    yardsale_uuid uuid NOT NULL,
    user_uuid uuid NOT NULL
);
CREATE SEQUENCE public.address_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.address_address_id_seq OWNED BY public.address.address_id;
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public."user".id;
ALTER TABLE ONLY public.address ALTER COLUMN address_id SET DEFAULT nextval('public.address_address_id_seq'::regclass);
ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (address_id);
ALTER TABLE ONLY public.seller
    ADD CONSTRAINT seller_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_uuid_key UNIQUE (uuid);
ALTER TABLE ONLY public.yardsale
    ADD CONSTRAINT yardsale_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.yardsale_seller_link
    ADD CONSTRAINT yardsale_seller_links_pkey PRIMARY KEY (uuid);
ALTER TABLE ONLY public.yardsale
    ADD CONSTRAINT yardsale_uuid_key UNIQUE (uuid);
CREATE TRIGGER set_public_addresses_updated_at BEFORE UPDATE ON public.address FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_addresses_updated_at ON public.address IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_seller_updated_at BEFORE UPDATE ON public.seller FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_seller_updated_at ON public.seller IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_transaction_updated_at BEFORE UPDATE ON public.transaction FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_transaction_updated_at ON public.transaction IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_updated_at ON public."user" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_yardsale_seller_links_updated_at BEFORE UPDATE ON public.yardsale_seller_link FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_yardsale_seller_links_updated_at ON public.yardsale_seller_link IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_yardsale_updated_at BEFORE UPDATE ON public.yardsale FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_yardsale_updated_at ON public.yardsale IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.seller
    ADD CONSTRAINT seller_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES public."user"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_seller_uuid_fkey FOREIGN KEY (seller_uuid) REFERENCES public.seller(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES public."user"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_yardsale_uuid_fkey FOREIGN KEY (yardsale_uuid) REFERENCES public.yardsale(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.yardsale_seller_link
    ADD CONSTRAINT yardsale_seller_links_seller_uuid_fkey FOREIGN KEY (seller_uuid) REFERENCES public.seller(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.yardsale_seller_link
    ADD CONSTRAINT yardsale_seller_links_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES public."user"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.yardsale_seller_link
    ADD CONSTRAINT yardsale_seller_links_yardsale_uuid_fkey FOREIGN KEY (yardsale_uuid) REFERENCES public.yardsale(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.yardsale
    ADD CONSTRAINT yardsale_user_id_fkey FOREIGN KEY (user_uuid) REFERENCES public."user"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
