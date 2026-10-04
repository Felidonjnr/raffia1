-- Raffia Legacy Marketplace v1
-- Run this entire file once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text default '',
  image text default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  subtitle text default '',
  description text default '',
  cover_image text default '',
  aspect_ratio text not null default '4:3' check (aspect_ratio in ('16:9','4:3','3:4','1:1')),
  curator_notes text default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.makers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  title text default '',
  location text default '',
  discipline text default '',
  speciality text default '',
  bio text default '',
  quote text default '',
  heritage_notes text default '',
  image text default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text default '',
  description text default '',
  price numeric(14,2) not null default 0 check (price >= 0),
  currency text not null default 'NGN',
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  maker_id uuid references public.makers(id) on delete set null,
  availability text not null default 'IN STOCK' check (availability in ('IN STOCK','MADE TO ORDER','LIMITED EDITION','ARCHIVE ONLY')),
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  lead_time text default '',
  materials text[] not null default '{}',
  origin text default '',
  dimensions text default '',
  care text default '',
  cover_image text default '',
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_number text not null default '',
  bank_name text not null default '',
  account_name text not null default '',
  account_number text not null default '',
  shipping_flat_rate numeric(14,2) not null default 15000 check (shipping_flat_rate >= 0),
  order_prefix text not null default 'RL',
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  role text not null default 'admin' check (role in ('admin','editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text,
  first_name text not null,
  last_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  state_region text not null,
  country text not null default 'Nigeria',
  postal_code text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  customer_address text not null,
  customer_city text not null,
  customer_state text not null,
  customer_country text not null default 'Nigeria',
  customer_postal_code text default '',
  patron_notes text default '',
  subtotal numeric(14,2) not null default 0 check (subtotal >= 0),
  shipping_fee numeric(14,2) not null default 0 check (shipping_fee >= 0),
  total numeric(14,2) not null default 0 check (total >= 0),
  payment_method text not null default 'MANUAL TRANSFER / WHATSAPP',
  payment_status text not null default 'AWAITING_CONFIRMATION' check (payment_status in ('PENDING','AWAITING_CONFIRMATION','PAID','FAILED','REFUNDED')),
  order_status text not null default 'NEW' check (order_status in ('NEW','PROCESSING','READY_FOR_DELIVERY','SHIPPED','DELIVERED','CANCELLED')),
  whatsapp_status text not null default 'READY',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(14,2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(14,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  payment_status text,
  order_status text,
  note text default '',
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists products_active_idx on public.products(is_active, is_featured);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_collection_idx on public.products(collection_id);
create index if not exists products_maker_idx on public.products(maker_id);
create index if not exists product_images_product_idx on public.product_images(product_id, sort_order);
alter table public.site_settings add column if not exists bank_name text not null default '';
alter table public.site_settings add column if not exists account_name text not null default '';
alter table public.site_settings add column if not exists account_number text not null default '';

create index if not exists orders_status_idx on public.orders(order_status, payment_status, created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists collections_updated_at on public.collections;
create trigger collections_updated_at before update on public.collections for each row execute function public.set_updated_at();
drop trigger if exists makers_updated_at on public.makers;
create trigger makers_updated_at before update on public.makers for each row execute function public.set_updated_at();
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists settings_updated_at on public.site_settings;
create trigger settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at before update on public.customers for each row execute function public.set_updated_at();
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

-- Automatically create profile for any authenticated user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email, 'Admin User'), 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','editor')
  );
$$;

insert into public.categories (name,slug,description,sort_order)
values
('Traditional Craft','traditional-craft','Hand-woven and heritage craft objects.',1),
('Objects & Living','objects-living','Functional raffia pieces for home and everyday life.',2),
('Art & Textiles','art-textiles','Woven fibre art and textile editions.',3),
('Fashion & Accessories','fashion-accessories','Contemporary raffia fashion and accessories.',4),
('Home & Lifestyle','home-lifestyle','Raffia pieces for living and interiors.',5),
('Art & Design','art-design','Contemporary raffia-led design objects.',6),
('Gifts','gifts','Raffia gifts and keepsakes.',7),
('Festival Merchandise','festival-merchandise','Official Raffia Festival editions and merchandise.',8)
on conflict (slug) do nothing;

insert into public.collections (name,slug,subtitle,description,cover_image,aspect_ratio,curator_notes,sort_order)
values
('Woven Bags & Accessories','woven-bags-accessories','Hand-woven raffia accessories with leather accents','Woven raffia bags and carries combining natural palm fibres with leather craftsmanship.','https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg','3:4','Handcrafted by community artisans in Akwa Ibom State.',1),
('Objects & Living','objects-vessels','Hand-woven vessels and tabletop accents','Decorative and functional woven raffia objects and dining accessories.','https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg','4:3','Woven using traditional hand-coiling techniques.',2),
('Art & Wall Textiles','wall-textiles','Woven fibre panels and wall hangings','Textile pieces exploring texture, structure and hand-knotted natural raffia fibres.','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg','1:1','Hand-knotted natural raffia wall hangings.',3),
('Traditional Craft & Headdresses','traditional-craft','Ceremonial raffia headdresses and craft objects','Traditional raffia craft objects celebrating regional weaving heritage.','https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG/1280px-Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG','4:3','Crafted in Ikot Ekpene LGA, Akwa Ibom State.',4),
('Festival Editions','festival-editions','Commemorative textiles and keepsake boxes','Commemorative pieces designed for the Raffia Festival celebration.','https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg','3:4','Official commemorative editions for the Raffia Festival.',5)
on conflict (slug) do nothing;

insert into public.makers (name,slug,title,location,discipline,speciality,image)
values
('Ikot Ekpene Weavers','ikot-ekpene-artisans','Artisans','Ikot Ekpene LGA, Akwa Ibom State, Nigeria','Raffia Craft & Weaving','Raffia Weaving','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg'),
('Akwa Ibom Textile Artisans','akwa-ibom-textiles','Designers & Makers','Akwa Ibom State, Nigeria','Raffia Design & Textiles','Raffia Textiles','https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG'),
('Community Weavers','community-weaving-collective','Artisan Collective','Akwa Ibom State, Nigeria','Raffia Craft','Woven Craft','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg')
on conflict (slug) do nothing;

insert into public.site_settings (id,whatsapp_number,shipping_flat_rate,order_prefix)
values (1, coalesce(nullif(current_setting('app.settings.whatsapp_number', true), ''), ''), 15000, 'RL')
on conflict (id) do nothing;

insert into public.products
(slug,name,short_description,description,price,currency,category_id,collection_id,maker_id,availability,lead_time,materials,origin,dimensions,care,cover_image,is_featured,is_new,stock_quantity)
select * from (values
('sculptural-raffia-vessel-no-04','Sculptural Raffia Vessel No. 04','Hand-woven raffia vessel with terracotta accent','A hand-woven sculptural vessel crafted from natural raffia palm fibre with terracotta accent detailing.',380000,'NGN','objects-living','objects-vessels','ikot-ekpene-artisans','LIMITED EDITION','Crafted in small batches',array['Natural Raffia Fibre','Clay'],'Ikot Ekpene LGA, Akwa Ibom State, Nigeria','38cm (H) x 26cm (W)','Dust gently with a dry, soft cloth. Keep away from excessive moisture.','https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',true,true,5),
('archival-woven-tote-in-saddle-leather','Woven Raffia Tote Bag','Woven raffia body with leather straps','A structured woven raffia tote crafted with natural fibres and fitted with leather handles.',485000,'NGN','traditional-craft','woven-bags-accessories','community-weaving-collective','IN STOCK','Available for order',array['Natural Raffia Fibre','Leather'],'Akwa Ibom State, Nigeria','42cm (L) x 32cm (H) x 14cm (D)','Spot clean with a slightly damp cloth.','https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',true,true,10),
('monolithic-fibre-tapestry-solitude','Woven Raffia Wall Tapestry','Hand-knotted woven fibre wall textile','A wall textile panel showcasing layered textures of natural hand-knotted raffia fibres on a wooden hanging batten.',1250000,'NGN','art-textiles','wall-textiles','akwa-ibom-textiles','MADE TO ORDER','Crafted on request',array['Natural Raffia Fibre','Wood'],'Akwa Ibom State, Nigeria','160cm (H) x 95cm (W)','Gently dust with a soft brush. Keep away from direct water exposure.','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',true,false,null),
('ancestral-ceremonial-raffia-mask','Traditional Woven Raffia Headdress','Ceremonial woven raffia craft object','A sculptural ceremonial craft piece featuring traditional raffia fibre weaving.',650000,'NGN','traditional-craft','traditional-craft','ikot-ekpene-artisans','LIMITED EDITION','Crafted in small quantities',array['Natural Raffia Fibre','Hardwood'],'Ikot Ekpene LGA, Akwa Ibom State, Nigeria','52cm (H) x 30cm (W)','Display indoors in a dry area.','https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG/1280px-Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',true,false,3),
('woven-palm-table-runner-set','Woven Raffia Table Runner & Mat Set','Set of 1 runner and 6 dining mats','Dining set woven from natural raffia palm fibre, bringing organic warmth and texture to table settings.',210000,'NGN','objects-living','objects-vessels','community-weaving-collective','IN STOCK','Available for order',array['Natural Raffia Fibre'],'Akwa Ibom State, Nigeria','Runner: 180cm x 38cm · Mats (x6): 42cm x 30cm each','Wipe clean with a dry or lightly damp cloth.','https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',false,true,12),
('indigo-dipped-envelope-clutch','Woven Raffia Envelope Clutch','Hand-woven accessory with fold-over closure','An envelope clutch woven with natural raffia yarn and cotton lining with closure.',185000,'NGN','traditional-craft','woven-bags-accessories','akwa-ibom-textiles','IN STOCK','Available for order',array['Natural Raffia Fibre','Cotton Lining'],'Akwa Ibom State, Nigeria','28cm (W) x 16cm (H)','Store in a dry cloth pouch.','https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',false,true,12),
('curators-keepsake-box-edition','Woven Raffia Keepsake Box','Woven palm keepsake box with wooden base','A woven raffia box fitted over a wooden base with a snug-fitting lid.',145000,'NGN','objects-living','objects-vessels','ikot-ekpene-artisans','IN STOCK','Available for order',array['Natural Raffia Fibre','Wood'],'Ikot Ekpene LGA, Akwa Ibom State, Nigeria','22cm (L) x 15cm (W) x 11cm (H)','Dust with a soft dry cloth.','https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',false,false,15),
('festival-inaugural-commemorative-foulard','Raffia Festival Scarf','Woven commemorative scarf with raffia accents','A lightweight commemorative scarf crafted for the Raffia Festival celebration.',165000,'NGN','art-textiles','festival-editions','akwa-ibom-textiles','LIMITED EDITION','Limited quantity',array['Silk','Raffia Fringe'],'Akwa Ibom State, Nigeria','190cm x 65cm','Gentle hand wash in lukewarm water. Lay flat to dry.','https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',false,true,20)
) as v(slug,name,short_description,description,price,currency,category_slug,collection_slug,maker_slug,availability,lead_time,materials,origin,dimensions,care,cover_image,is_featured,is_new,stock_quantity)
join public.categories c on c.slug=v.category_slug
join public.collections co on co.slug=v.collection_slug
join public.makers m on m.slug=v.maker_slug
where not exists (select 1 from public.products p where p.slug=v.slug);

insert into public.product_images (product_id,url,alt_text,sort_order,is_primary)
select p.id,p.cover_image,p.name,0,true
from public.products p
where p.cover_image <> ''
and not exists (select 1 from public.product_images pi where pi.product_id=p.id);

insert into public.product_images (product_id,url,alt_text,sort_order,is_primary)
select p.id,
case p.slug
  when 'sculptural-raffia-vessel-no-04' then 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg'
  when 'archival-woven-tote-in-saddle-leather' then 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg'
  when 'monolithic-fibre-tapestry-solitude' then p.cover_image
  when 'ancestral-ceremonial-raffia-mask' then p.cover_image
  when 'woven-palm-table-runner-set' then p.cover_image
  when 'indigo-dipped-envelope-clutch' then p.cover_image
  when 'curators-keepsake-box-edition' then p.cover_image
  when 'festival-inaugural-commemorative-foulard' then p.cover_image
end,
p.name || ' detail',
1,false
from public.products p
where p.slug in ('sculptural-raffia-vessel-no-04','archival-woven-tote-in-saddle-leather')
and not exists (select 1 from public.product_images pi where pi.product_id=p.id and pi.sort_order=1);

create or replace function public.create_manual_order(p_customer jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(14,2) := 0;
  v_shipping numeric(14,2);
  v_total numeric(14,2);
  v_customer_id uuid;
  v_prefix text;
  v_whatsapp text;
  v_bank_name text;
  v_account_name text;
  v_account_number text;
  item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_line numeric(14,2);
begin
  if jsonb_array_length(p_items) < 1 then raise exception 'Your cart is empty.'; end if;

  if length(trim(coalesce(p_customer->>'firstName',''))) < 1
     or length(trim(coalesce(p_customer->>'lastName',''))) < 1
     or length(trim(coalesce(p_customer->>'phone',''))) < 7
     or length(trim(coalesce(p_customer->>'address',''))) < 3
     or length(trim(coalesce(p_customer->>'city',''))) < 1
     or length(trim(coalesce(p_customer->>'stateRegion',''))) < 1 then
    raise exception 'Please provide all required customer and delivery details.';
  end if;

  for item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest(1, coalesce((item->>'quantity')::integer, 1));
    select * into v_product from public.products
    where (
      case when (item->>'productId') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
           then id = (item->>'productId')::uuid
           else false end
      or slug = (item->>'productId')
    ) and is_active = true
    for update;
    if not found then raise exception 'A selected product is no longer available.'; end if;
    if v_product.availability = 'ARCHIVE ONLY' then raise exception '% is no longer available for purchase.', v_product.name; end if;
    if v_product.stock_quantity is not null and v_product.stock_quantity < v_qty then
      raise exception 'Not enough stock for %.', v_product.name;
    end if;
    v_line := v_product.price * v_qty;
    v_subtotal := v_subtotal + v_line;
  end loop;

  select shipping_flat_rate, order_prefix, whatsapp_number, bank_name, account_name, account_number
    into v_shipping, v_prefix, v_whatsapp, v_bank_name, v_account_name, v_account_number
  from public.site_settings where id = 1;
  v_shipping := coalesce(v_shipping, 15000);
  v_prefix := coalesce(nullif(v_prefix,''),'RL');
  v_total := v_subtotal + v_shipping;
  v_order_number := v_prefix || '-' || to_char(now(),'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));

  insert into public.customers(first_name,last_name,email,phone,address,city,state_region,country,postal_code)
  values (
    trim(p_customer->>'firstName'), trim(p_customer->>'lastName'), nullif(trim(p_customer->>'email'),''),
    trim(p_customer->>'phone'), trim(p_customer->>'address'), trim(p_customer->>'city'),
    trim(p_customer->>'stateRegion'), coalesce(nullif(trim(p_customer->>'country'),''),'Nigeria'),
    coalesce(trim(p_customer->>'postalCode'),'')
  ) returning id into v_customer_id;

  insert into public.orders(
    order_number,customer_id,customer_name,customer_email,customer_phone,customer_address,
    customer_city,customer_state,customer_country,customer_postal_code,patron_notes,
    subtotal,shipping_fee,total
  ) values (
    v_order_number,v_customer_id,
    trim(p_customer->>'firstName') || ' ' || trim(p_customer->>'lastName'),
    nullif(trim(p_customer->>'email'),''),trim(p_customer->>'phone'),trim(p_customer->>'address'),
    trim(p_customer->>'city'),trim(p_customer->>'stateRegion'),
    coalesce(nullif(trim(p_customer->>'country'),''),'Nigeria'),coalesce(trim(p_customer->>'postalCode'),''),
    coalesce(trim(p_customer->>'patronNotes'),''),v_subtotal,v_shipping,v_total
  ) returning id into v_order_id;

  for item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest(1, coalesce((item->>'quantity')::integer, 1));
    select * into v_product from public.products
    where (
      case when (item->>'productId') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
           then id = (item->>'productId')::uuid
           else false end
      or slug = (item->>'productId')
    ) and is_active = true
    for update;
    v_line := v_product.price * v_qty;
    insert into public.order_items(order_id,product_id,product_name,unit_price,quantity,subtotal)
    values(v_order_id,v_product.id,v_product.name,v_product.price,v_qty,v_line);

    if v_product.stock_quantity is not null and v_product.availability <> 'MADE TO ORDER' then
      update public.products set stock_quantity = stock_quantity - v_qty,
        availability = case when stock_quantity - v_qty = 0 then 'LIMITED EDITION' else availability end
      where id = v_product.id;
    end if;
  end loop;

  insert into public.order_status_history(order_id,payment_status,order_status,note)
  values(v_order_id,'AWAITING_CONFIRMATION','NEW','Order created through marketplace checkout.');

  return jsonb_build_object(
    'order_id',v_order_id,
    'order_number',v_order_number,
    'subtotal',v_subtotal,
    'shipping_fee',v_shipping,
    'total',v_total,
    'whatsapp_number',coalesce(v_whatsapp,''),
    'bank_name',coalesce(v_bank_name,''),
    'account_name',coalesce(v_account_name,''),
    'account_number',coalesce(v_account_number,'')
  );
end;
$$;

grant execute on function public.create_manual_order(jsonb,jsonb) to anon, authenticated;

grant select on public.categories, public.collections, public.makers, public.products, public.product_images, public.site_settings to anon, authenticated;
grant select, insert, update, delete on public.categories, public.collections, public.makers, public.products, public.product_images, public.site_settings, public.profiles, public.customers, public.orders, public.order_items, public.order_status_history to authenticated;

-- Public catalog reads.
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.makers enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

drop policy if exists public_active_categories on public.categories;
create policy public_active_categories on public.categories for select to anon,authenticated using (is_active = true or public.is_admin());

drop policy if exists public_active_collections on public.collections;
create policy public_active_collections on public.collections for select to anon,authenticated using (is_active = true or public.is_admin());

drop policy if exists public_active_makers on public.makers;
create policy public_active_makers on public.makers for select to anon,authenticated using (is_active = true or public.is_admin());

drop policy if exists public_active_products on public.products;
create policy public_active_products on public.products for select to anon,authenticated using (is_active = true or public.is_admin());

drop policy if exists public_product_images on public.product_images;
create policy public_product_images on public.product_images for select to anon,authenticated using (
  exists(select 1 from public.products p where p.id=product_id and (p.is_active=true or public.is_admin()))
);

drop policy if exists public_settings on public.site_settings;
create policy public_settings on public.site_settings for select to anon,authenticated using (true);

-- Admin/editor writes.
drop policy if exists admin_categories on public.categories;
create policy admin_categories on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_collections on public.collections;
create policy admin_collections on public.collections for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_makers on public.makers;
create policy admin_makers on public.makers for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_products on public.products;
create policy admin_products on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_product_images on public.product_images;
create policy admin_product_images on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_settings on public.site_settings;
create policy admin_settings on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_orders on public.orders;
create policy admin_orders on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_order_items on public.order_items;
create policy admin_order_items on public.order_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_history on public.order_status_history;
create policy admin_history on public.order_status_history for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists own_profile on public.profiles;
create policy own_profile on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
drop policy if exists own_profile_insert on public.profiles;
create policy own_profile_insert on public.profiles for insert to authenticated with check (id=auth.uid());
drop policy if exists own_profile_update on public.profiles;
create policy own_profile_update on public.profiles for update to authenticated using (id=auth.uid());
drop policy if exists admin_profiles on public.profiles;
create policy admin_profiles on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Customers are private. Orders are created through the SECURITY DEFINER function
-- and are readable only by admins.
drop policy if exists admin_customers on public.customers;
create policy admin_customers on public.customers for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket for marketplace images.
insert into storage.buckets (id,name,public)
values ('marketplace','marketplace',true)
on conflict (id) do update set public=true;

drop policy if exists marketplace_public_read on storage.objects;
create policy marketplace_public_read on storage.objects for select using (bucket_id='marketplace');

drop policy if exists marketplace_admin_insert on storage.objects;
create policy marketplace_admin_insert on storage.objects for insert to authenticated with check (bucket_id='marketplace' and public.is_admin());

drop policy if exists marketplace_admin_update on storage.objects;
create policy marketplace_admin_update on storage.objects for update to authenticated using (bucket_id='marketplace' and public.is_admin()) with check (bucket_id='marketplace' and public.is_admin());

drop policy if exists marketplace_admin_delete on storage.objects;
create policy marketplace_admin_delete on storage.objects for delete to authenticated using (bucket_id='marketplace' and public.is_admin());

-- Automatic history record for admin order changes.
create or replace function public.record_order_status_change()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if old.payment_status is distinct from new.payment_status
     or old.order_status is distinct from new.order_status then
    insert into public.order_status_history(order_id,payment_status,order_status,note,changed_by)
    values(new.id,new.payment_status,new.order_status,'Order status updated from admin dashboard.',auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists order_status_history_trigger on public.orders;
create trigger order_status_history_trigger
after update on public.orders
for each row execute function public.record_order_status_change();


-- Enable Realtime for public catalog changes.
do $$
declare
  tbl text;
begin
  foreach tbl in array array['products','product_images','collections','makers','categories'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname='supabase_realtime' and schemaname='public' and tablename=tbl
    ) then
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    end if;
  end loop;
end $$;

-- Bulk production catalog seed
-- Four products prepared from the latest supplier batch.
-- Cloudinary URLs intentionally left blank for later update.
insert into public.products
(slug,name,short_description,description,price,currency,category_id,availability,stock_quantity,cover_image,is_featured,is_new,is_active)
select v.slug,v.name,v.short_description,v.description,v.price,'NGN',c.id,'IN STOCK',null,v.cover_image,v.is_featured,v.is_new,true
from (values
('multicolour-patterned-raffia-shoulder-bag','Multicolour Patterned Raffia Shoulder Bag','Raffia shoulder bag','',15000,'',true,true),
('brown-striped-raffia-handbag-set','Brown Striped Raffia Handbag Set','Raffia handbag set','',45000,'',true,true),
('purple-dark-striped-raffia-handbags','Purple & Dark Striped Raffia Handbags','Raffia handbags','',20000,'',false,true),
('red-plaid-raffia-handbags','Red & Plaid Raffia Handbags','Raffia handbags','',30000,'',false,true)
) as v(slug,name,short_description,description,price,cover_image,is_featured,is_new)
join public.categories c on c.slug='fashion-accessories'
where not exists (select 1 from public.products p where p.slug=v.slug);
