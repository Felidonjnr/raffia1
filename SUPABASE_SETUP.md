# Raffia Legacy Marketplace — Supabase Setup

The marketplace is now database-backed. The current React catalog remains a safe fallback until Supabase is configured.

## 1. Create the Supabase project
Open Supabase SQL Editor and run the complete file:
`supabase/migrations/202610040001_marketplace.sql`

It creates the marketplace tables, relationships, RLS policies, admin profiles, public marketplace image bucket, and secure `create_manual_order` function.

## 2. Create the first admin
In Supabase → Authentication → Users, create the email/password account you will use for the dashboard.

Then run:

```sql
insert into public.profiles (id, full_name, role)
select id, 'Raffia Legacy Administrator', 'admin'
from auth.users
where email = 'YOUR-ADMIN-EMAIL';
```

The dashboard route is:
`#/admin`

## 3. Configure Vercel
Add:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Do not expose a Supabase secret/service-role key in the Vite frontend. The browser uses the publishable key and RLS protects database access.

Redeploy after adding the variables.

## 4. Configure the marketplace
Open Admin → Settings and set:
- WhatsApp business number, international format without +
- Flat shipping fee
- Order prefix

The default order prefix is `RL`.

## 5. What the admin dashboard controls
- Products: add/edit, price, stock, availability, images, category, collection, maker, featured/new flags, visibility
- Orders: customer details, line items, totals, payment status, order status
- Makers
- Collections
- Categories
- Marketplace settings

## 6. Manual WhatsApp checkout
The checkout creates the order in Supabase first. The database function re-checks live prices and stock, snapshots the product name/price into `order_items`, then returns an order number. The storefront opens WhatsApp with the itemised order.

Admin then confirms the transfer and updates payment/order status.

Historical order totals remain unchanged if a product price changes later.

## 7. Images
The dashboard can upload product images to the public `marketplace` Supabase Storage bucket or accept an external image URL. For production, prefer Supabase Storage for final marketplace assets.

## 8. Paystack later
Paystack is intentionally disabled in the active checkout for now. The order model already separates payment method, payment status, and order status, so a gateway can be added later without rebuilding the marketplace.
