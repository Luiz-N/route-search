Route-search
============

http://luiz-n.github.io/route-search/

Stack:

* HTML/SASS
* Javascript/Jquery
* Google maps, directions, and places APIs


The inspiration for this app came from some personal use cases I've had of wanting to see what bars/restaurants are on the way to my friends house or whereever I needed to go.
There are apps that offer this kind of info at a macro-scale for roadtrips but I couldn't find anthing that can do it at a micro scale.
Admittingly this would only be truly useful with a mobile version but that's what pull requests are for ;).

Points of Interest:

* This app is probably about 80% google apis. (Even the circles)
* Every circle is a seperate ajax call. The delay between each circle's results is intentional to avoid hitting Google too fast. (They don't like that)
* This was intended for short distances but it actually does work for long distances. (google will eventually start choking you though)


Next potential steps:

* Clicking on a marker will display their full google places info. (stars, dollar signs, reviews, etc.)
* Mobile version
* Smarter algorithms for the custom icons
* Different color scheme
* An actualy name (suggestions welcome)

Pull requests are cool too.
