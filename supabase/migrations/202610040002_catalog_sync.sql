-- Raffia Legacy Marketplace v1.1
-- This migration synchronises the existing 8-product TypeScript catalogue into Supabase.
-- After this migration, marketplace edits should be made from /#/admin, not SQL.

-- Exact catalogue metadata
update public.collections set
  name='Woven Bags & Accessories',
  subtitle='Hand-woven raffia accessories with leather accents',
  description='Woven raffia bags and carries combining natural palm fibres with leather craftsmanship.',
  cover_image='https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',
  aspect_ratio='3:4',
  curator_notes='Handcrafted by community artisans in Akwa Ibom State.',
  sort_order=1,
  is_active=true
where slug='woven-bags-accessories';

update public.collections set
  name='Objects & Living',
  subtitle='Hand-woven vessels and tabletop accents',
  description='Decorative and functional woven raffia objects and dining accessories.',
  cover_image='https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
  aspect_ratio='4:3',
  curator_notes='Woven using traditional hand-coiling techniques.',
  sort_order=2,
  is_active=true
where slug='objects-vessels';

update public.collections set
  name='Art & Wall Textiles',
  subtitle='Woven fibre panels and wall hangings',
  description='Textile pieces exploring texture, structure and hand-knotted natural raffia fibres.',
  cover_image='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
  aspect_ratio='1:1',
  curator_notes='Hand-knotted natural raffia wall hangings.',
  sort_order=3,
  is_active=true
where slug='wall-textiles';

update public.collections set
  name='Traditional Craft & Headdresses',
  subtitle='Ceremonial raffia headdresses and craft objects',
  description='Traditional raffia craft objects celebrating regional weaving heritage.',
  cover_image='https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG/1280px-Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',
  aspect_ratio='4:3',
  curator_notes='Crafted in Ikot Ekpene LGA, Akwa Ibom State.',
  sort_order=4,
  is_active=true
where slug='traditional-craft';

update public.collections set
  name='Festival Editions',
  subtitle='Commemorative textiles and keepsake boxes',
  description='Commemorative pieces designed for the Raffia Festival celebration.',
  cover_image='https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',
  aspect_ratio='3:4',
  curator_notes='Official commemorative editions for the Raffia Festival.',
  sort_order=5,
  is_active=true
where slug='festival-editions';

-- Makers
update public.makers set
  name='Ikot Ekpene Weavers', title='Artisans',
  location='Ikot Ekpene LGA, Akwa Ibom State, Nigeria',
  discipline='Raffia Craft & Weaving', speciality='Raffia Weaving',
  bio='', quote='', heritage_notes='',
  image='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
  is_active=true
where slug='ikot-ekpene-artisans';

update public.makers set
  name='Akwa Ibom Textile Artisans', title='Designers & Makers',
  location='Akwa Ibom State, Nigeria',
  discipline='Raffia Design & Textiles', speciality='Raffia Textiles',
  bio='', quote='', heritage_notes='',
  image='https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG',
  is_active=true
where slug='akwa-ibom-textiles';

update public.makers set
  name='Community Weavers', title='Artisan Collective',
  location='Akwa Ibom State, Nigeria',
  discipline='Raffia Craft', speciality='Woven Craft',
  bio='', quote='', heritage_notes='',
  image='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
  is_active=true
where slug='community-weaving-collective';

-- Product catalogue. Existing rows are updated by slug; no duplicate products are created.
update public.products p set
  name=v.name, short_description=v.short_description, description=v.description,
  price=v.price, currency='NGN', category_id=c.id, collection_id=co.id, maker_id=m.id,
  availability=v.availability, lead_time=v.lead_time, materials=v.materials,
  origin=v.origin, dimensions=v.dimensions, care=v.care, cover_image=v.cover_image,
  is_featured=v.is_featured, is_new=v.is_new, is_active=true, stock_quantity=v.stock_quantity
from (values
('sculptural-raffia-vessel-no-04','Sculptural Raffia Vessel No. 04','Hand-woven raffia vessel with terracotta accent','A hand-woven sculptural vessel crafted from natural raffia palm fibre with terracotta accent detailing.',380000,'OBJECTS & LIVING','objects-vessels','ikot-ekpene-artisans','LIMITED EDITION','Crafted in small batches',array['Natural Raffia Fibre','Clay'],'Ikot Ekpene LGA, Akwa Ibom State, Nigeria','38cm (H) x 26cm (W)','Dust gently with a dry, soft cloth. Keep away from excessive moisture.','https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',true,true,null),
('archival-woven-tote-in-saddle-leather','Woven Raffia Tote Bag','Woven raffia body with leather straps','A structured woven raffia tote crafted with natural fibres and fitted with leather handles.',485000,'TRADITIONAL CRAFT','woven-bags-accessories','community-weaving-collective','IN STOCK','Available for order',array['Natural Raffia Fibre','Leather'],'Akwa Ibom State, Nigeria','42cm (L) x 32cm (H) x 14cm (D)','Spot clean with a slightly damp cloth.','https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',true,true,10),
('monolithic-fibre-tapestry-solitude','Woven Raffia Wall Tapestry','Hand-knotted woven fibre wall textile','A wall textile panel showcasing layered textures of natural hand-knotted raffia fibres on a wooden hanging batten.',1250000,'ART & TEXTILES','wall-textiles','akwa-ibom-textiles','MADE TO ORDER','Crafted on request',array['Natural Raffia Fibre','Wood'],'Akwa Ibom State, Nigeria','160cm (H) x 95cm (W)','Gently dust with a soft brush. Keep away from direct water exposure.','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',true,false,null),
('ancestral-ceremonial-raffia-mask','Traditional Woven Raffia Headdress','Ceremonial woven raffia craft object','A sculptural ceremonial craft piece featuring traditional raffia fibre weaving.',650000,'TRADITIONAL CRAFT','traditional-craft','ikot-ekpene-artisans','LIMITED EDITION','Crafted in small quantities',array['Natural Raffia Fibre','Hardwood'],'Ikot Ekpene LGA, Akwa Ibom State, Nigeria','52cm (H) x 30cm (W)','Display indoors in a dry area.','https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG/1280px-Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',true,false,3),
('woven-palm-table-runner-set','Woven Raffia Table Runner & Mat Set','Set of 1 runner and 6 dining mats','Dining set woven from natural raffia palm fibre, bringing organic warmth and texture to table settings.',210000,'OBJECTS & LIVING','objects-vessels','community-weaving-collective','IN STOCK','Available for order',array['Natural Raffia Fibre'],'Akwa Ibom State, Nigeria','Runner: 180cm x 38cm · Mats (x6): 42cm x 30cm each','Wipe clean with a dry or lightly damp cloth.','https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',false,true,12),
('indigo-dipped-envelope-clutch','Woven Raffia Envelope Clutch','Hand-woven accessory with fold-over closure','An envelope clutch woven with natural raffia yarn and cotton lining with closure.',185000,'TRADITIONAL CRAFT','woven-bags-accessories','akwa-ibom-textiles','IN STOCK','Available for order',array['Natural Raffia Fibre','Cotton Lining'],'Akwa Ibom State, Nigeria','28cm (W) x 16cm (H)','Store in a dry cloth pouch.','https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',false,true,12),
('curators-keepsake-box-edition','Woven Raffia Keepsake Box','Woven palm keepsake box with wooden base','A woven raffia box fitted over a wooden base with a snug-fitting lid.',145000,'OBJECTS & LIVING','objects-vessels','ikot-ekpene-artisans','IN STOCK','Available for order',array['Natural Raffia Fibre','Wood'],'Ikot Ekpene LGA, Akwa Ibom State, Nigeria','22cm (L) x 15cm (W) x 11cm (H)','Dust with a soft dry cloth.','https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',false,false,15),
('festival-inaugural-commemorative-foulard','Raffia Festival Scarf','Woven commemorative scarf with raffia accents','A lightweight commemorative scarf crafted for the Raffia Festival celebration.',165000,'ART & TEXTILES','festival-editions','akwa-ibom-textiles','LIMITED EDITION','Limited quantity',array['Silk','Raffia Fringe'],'Akwa Ibom State, Nigeria','190cm x 65cm','Gentle hand wash in lukewarm water. Lay flat to dry.','https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',false,true,20)
) as v(slug,name,short_description,description,price,category_name,collection_slug,maker_slug,availability,lead_time,materials,origin,dimensions,care,cover_image,is_featured,is_new,stock_quantity)
join public.categories c on c.name=v.category_name
join public.collections co on co.slug=v.collection_slug
join public.makers m on m.slug=v.maker_slug
where p.slug=v.slug;

-- Make gallery records exactly match the product source data.
delete from public.product_images pi
using public.products p
where pi.product_id=p.id
and p.slug in (
'sculptural-raffia-vessel-no-04','archival-woven-tote-in-saddle-leather',
'monolithic-fibre-tapestry-solitude','ancestral-ceremonial-raffia-mask',
'woven-palm-table-runner-set','indigo-dipped-envelope-clutch',
'curators-keepsake-box-edition','festival-inaugural-commemorative-foulard'
);

insert into public.product_images(product_id,url,alt_text,sort_order,is_primary)
select p.id, v.url, p.name, v.sort_order, v.sort_order=0
from public.products p
cross join lateral (
  values
  ('https://upload.wikimedia.org/wikipedia.org/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',0)
) as v(url,sort_order)
where false;

insert into public.product_images(product_id,url,alt_text,sort_order,is_primary)
select p.id, p.cover_image, p.name, 0, true
from public.products p
where p.slug in (
'sculptural-raffia-vessel-no-04','archival-woven-tote-in-saddle-leather',
'monolithic-fibre-tapestry-solitude','ancestral-ceremonial-raffia-mask',
'woven-palm-table-runner-set','indigo-dipped-envelope-clutch',
'curators-keepsake-box-edition','festival-inaugural-commemorative-foulard'
);

insert into public.product_images(product_id,url,alt_text,sort_order,is_primary)
select p.id,
case p.slug
when 'sculptural-raffia-vessel-no-04' then 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg'
when 'archival-woven-tote-in-saddle-leather' then 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg'
else null end,
p.name,1,false
from public.products p
where p.slug in ('sculptural-raffia-vessel-no-04','archival-woven-tote-in-saddle-leather');

-- Ensure the current five collections and three makers are visible.
update public.collections set is_active=true where slug in ('woven-bags-accessories','objects-vessels','wall-textiles','traditional-craft','festival-editions');
update public.makers set is_active=true where slug in ('ikot-ekpene-artisans','akwa-ibom-textiles','community-weaving-collective');
