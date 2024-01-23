insert into public.account(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

update account
set account_type = 'Admin'
where account_id = 1;

delete from account
where account_id = 1;

UPDATE 
   inventory
SET 
   inv_description = REPLACE(inv_description,'the small interior','a huge interior')
WHERE 
   inv_id = 10;
   
select iv.inv_make, iv.inv_model, cl.classification_name
from inventory iv
inner join classification cl on iv.classification_id = cl.classification_id
where cl.classification_name = 'Sport';

UPDATE inventory
SET
  inv_image = regexp_replace(inv_image, '/images/', '/images/vehicles/', 'g'),
  inv_thumbnail = regexp_replace(inv_thumbnail, '/images/', '/images/vehicles/', 'g');

  
