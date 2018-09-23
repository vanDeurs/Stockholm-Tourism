# Stockholm Tourism
Det här projektet är en Single Page Application byggt på React.js som använder sig av Google Maps API. Användare kan spara platser till en lista genom att klicka på platsen på kartan och fylla i valfritt namn för platsen. Listan är sökbar, och genom att klicka på en sparad plats i listan så tas man till dess position på kartan. Det går även att radera sparade platser.

## Getting Started
Klona detta repo, och kör sedan: 
``` 
cd stockholm-tourism
npm install
npm start
```
Öppna sedan [localhost:3000](http://localhost:3000/) i en webbläsare.

## Demo
[Demo](https://stockholm-tourism-application.herokuapp.com/)

## Tankar om projeket och hur jag gick tillväga
Jag löste projektet stegvis. Jag började med att göra allt grundläggande för att få projektet på benen. Det innebar atts sätta upp en mapp-struktur, sätta upp ESLint, och välja hur jag skulle gå tillväga med Google Maps. Jag valde att till en början använda paketet google-maps-react, då det var välanvänt, hade en bra dokumentation och en väldigt enkelt setup. Därefter så testade jag runt och försökte få till det mest grundläggande gällande paketet och funktionaliteten jag behövde, såsom att öppna information window och hur markers fungerade. Där stötte jag på ett problem med paketet, som innebar att jag inte kunde få ut positionen (latitude och longitude) på den position som jag klickat på på kartan. Det i sig skulle göra det omöjligt för mig att navigera till den positionen, eller spara en marker på den platsen. Det ledde till att jag senare bytte paket till google-map-react, som fungerade på nästan exakt samma sätt förutom att jag nu kunde få ut positionen av platsen som jag klickat på. Det mindre bra med detta paket var att det var relativt gammalt och inte väldokumenterat, men jämfört med andra paket så hade det likt det första paketet en enkel setup och fyllde den funktionalitet som jag behövde. Efter att jag hade sökt runt efter lösningar för position- problemet i några timmar så bestämde jag mig för att fixa med resten av funktionaliteten till applikationen först för att inte stå still. Så då började jag med listan för dom sparade platserna, sökfältet och själva funktionaliteten att spara en plats till listan. När jag gjort klart det så återgick jag till problemet, och hittade då det nya paketet som jag bytte till. 

Ett problem som jag stötte på med det nya paketet var hur jag renderade markers och informations boxar. Det var inte på samma sätt som med det första paketet, och då dokumentationen var bristfällig så bestämde jag mig för att skapa egna markers och placera ut dom med min egen funktionalitet. Det fungerade bra tills jag insåg att positionen för markers ändrades när jag zoomade ut, vilket innebar att en marker som till en början placerats i Stockholm låg ute i vattnet när man zoomade ut. Det var då som jag bestämde mig för att ge Google Maps egna markers ett försök, och lyckades då med hjälp av dokumentationen för Google Maps API placera ut markers på sin rätta plats. Om jag hade spenderat lite mer tid på själva Google Maps API dokumentationen från början så hade det troligtvis sparat mig några timmars arbete. Detsamma gällde informationsrutan som jag också från en början gjorde själv, men i samband med att jag började läsa mer på API dokumentationen så använde jag deras egna informationsruta.
