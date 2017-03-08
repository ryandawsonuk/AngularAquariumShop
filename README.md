##Aquatics shop in AngularJS

The idea of this exercise is that the user be able to choose fish from a list available in a shop for a new tank. Selections get verified as we go along by reference to a compatibility request API. The page is hosted at https://ryandawsonuk.github.io/AngularAquariumShop/

There are some unresolved questions:

1. Some fish in the shop are not recognised by the backend API as it reports them as unrecognised. Should we remove them from the shop list? They do look probably invalid. Currently we give the misleading message of 'Technical issue try again' when one of them is selected. This is because the detailed message isn't available to the code unless CORS is disabled in the browser. I think this is because the server is only sending the Access-Control-Allow-Origin header in the case of a 200 and not for the 400 or 500s.
2. Should we allow duplicate fish? If so we would want to track quantity, probably using a new object that would contain fish name and quantity. Currently handling duplicates just by giving the user a message each time they try to add a duplicate.
3. The backend occasionally reports that the shop is flooded. This gets reported to user as technical issue try again but is this the best way to handle it?
4. Should we verify compatibility again before purchase?
