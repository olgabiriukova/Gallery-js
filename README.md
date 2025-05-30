# Gallery

## Cíl projektu

Cílem projektu je vytvořit moderní webovou aplikaci pro tvorbu a správu online galerií obrázků s možností přidávání textových a audio komentářů, kreslení na obrázky a podporou offline režimu. Data jsou uložena v IndexedDB pro spolehlivé a rychlé lokální ukládání.

## Postup

- Navržení struktury aplikace v React s použitím React Router.
- Vytvoření komponent pro hlavní stránku, galerii a detail obrázku.
- Přidání kreslení na canvas.
- Implementace audio komentářů.
- Zajištění offline režimu pomocí service workeru a detekce připojení.
- Využití History API pro správu historie prohlížení.
- Komplexní validace HTML5, responzivní design a animace v CSS.

## Popis funkčnosti

### Hlavní stránka

- Zobrazuje **recentní obrázek**.
- V levém horním rohu je **indikátor připojení k síti** (online/offline).
- Navigace na další stránky: **My Gallery**.

### My Gallery

- Zobrazuje všechny uložené obrázky z IndexedDB v galerii.
- Uživatel může nahrát nové obrázky přes formulář s validací.
- Kliknutím na obrázek přejde na stránku detailu obrázku.

### Detail obrázku

- Zobrazuje vybraný obrázek.
- Umožňuje kreslit přímo na obrázek pomocí canvas.
- Ukládá kresbu do IndexedDB, takže je dostupná i po opětovném načtení.
- Podporuje přidání audio komentářů a jejich přehrávání.

### Offline režim

- Aplikace funguje bez připojení díky service workeru a ukládání dat do IndexedDB.
- Indikátor v levém horním rohu mění stav podle dostupnosti internetu.

### Historie prohlížení

- Uživatel může používat tlačítka zpět/vpřed v prohlížeči.
- Aplikace správně reaguje na změnu URL a stav aplikace odpovídá aktuální stránce.
