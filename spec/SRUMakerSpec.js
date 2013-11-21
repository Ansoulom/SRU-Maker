describe("Hello test", function() {
    it("says hello", function() {
        expect(helloTest()).toEqual("Hello test!");
    });
});

describe("Databeskrivning", function() {
        var databeskrivning = new Databeskrivning();
        
        it("Ska ha en start", function() {
                expect(databeskrivning.databeskrivningStart()).toEqual("#DATABESKRIVNING_START");
        });

        it("Ska ha ett slut", function() {
                expect(databeskrivning.databeskrivningSlut()).toEqual("#DATABESKRIVNING_SLUT");
        });

        it("Ska omsluta inneh�llet", function() {
                var inneh�ll = databeskrivning.generera();
                expect(inneh�ll[0]).toEqual("#DATABESKRIVNING_START");
                expect(inneh�ll[inneh�ll.length - 1]).toEqual("#DATABESKRIVNING_SLUT");
        });

        describe("Generering av obligatoriska uppgifter", function() {
                it("Ska ha dagens datum och tid i r�tt format", function() {
                        expect(databeskrivning.skapad()).toMatch(/#SKAPAD \d\d\d\d\d\d\d\d \d\d\d\d\d\d/);
                });

                it("Ska ha produkt som SRU", function() {
                        expect(databeskrivning.produkt()).toEqual("#PRODUKT SRU");
                });

                it("Ska ha program som SRU-Maker", function() {
                        expect(databeskrivning.program()).toEqual("#PROGRAM SRU-Maker");
                });

                it("Ska ha filnamn som BLANKETTER.SRU", function() {
                        expect(databeskrivning.filnamn()).toEqual("#FILNAMN BLANKETTER.SRU");
                });
        });
});

describe("Medieleverant�ren", function() {
        var medielev = new Medielev("198105198256", "Bj�rn Palmqvist", "90629", "Ume�");
        
        it("Ska ha en start", function() {
                expect(medielev.medielevStart()).toEqual("#MEDIELEV_START");
        });

        it("Ska ha ett slut", function() {
                expect(medielev.medielevSlut()).toEqual("#MEDIELEV_SLUT");
        });

        it("Ska omsluta inneh�llet", function() {
                var inneh�ll = medielev.generera();
                expect(inneh�ll[0]).toEqual("#MEDIELEV_START");
                expect(inneh�ll[inneh�ll.length - 1]).toEqual("#MEDIELEV_SLUT");
        });

        describe("Generering av obligatoriska uppgifter", function() {
                it("Ska ha orgnr", function() {
                        expect(medielev.orgNr()).toMatch(/#ORGNR \d\d\d\d\d\d\d\d\d\d/);
                });

                it("Ska ha namn", function() {
                        expect(medielev.namn()).toMatch(/#NAMN [a-zA-Z������ ]+/);
                });

                it("Ska ha postnummer", function() {
                        expect(medielev.postNr()).toMatch(/#POSTNR \d\d\d\d\d/);
                });

                it("Ska ha postorten", function() {
                        expect(medielev.postOrt()).toMatch(/#POSTORT [a-zA-Z������]+/);
                });
        });
});


describe("Info SRU ska g� att generera", function() {
        it("Generera INFO_SRU", function() {
                var infoSru = genereraInfoSru("198105198256", "Bj�rn Palmqvist", "90629", "Ume�");
                expect(infoSru).toMatch(/#PROGRAM [a-zA-Z������ ]+/);
                expect(infoSru).toMatch(/#ORGNR 198105198256/);
                expect(infoSru).toMatch(/#NAMN Bj�rn Palmqvist/);
                expect(infoSru).toMatch(/#POSTORT Ume�/);
                expect(infoSru).toMatch(/#FILNAMN BLANKETTER.SRU/);
        });
});

describe("Hantering av Blankett", function() {
        var blankett;
        var blankettId = "K10-2013";
        var idOrgNr = "198105198256";

        beforeEach(function() {
                blankett = new Blankett(blankettId, idOrgNr);
        });

        it("Ska ha en b�rjan med id", function() {
                expect(blankett.start()).toEqual("#BLANKETT " + blankettId);
        });

        it("Ska ha en identitet med r�tt format", function() {
                expect(blankett.identitet()).toMatch(/#IDENTITET \d\d\d\d\d\d\d\d\d\d\d\d \d\d\d\d\d\d\d\d \d\d\d\d\d\d/);
        });

        it("Ska ha ett slut", function() {
                expect(blankett.slut()).toEqual("#BLANKETTSLUT");
        });

        it("De ska g� att generera blanketten", function() {
                var inneh�ll = blankett.generera();

                expect(inneh�ll[0]).toEqual(blankett.start());
                expect(inneh�ll[1]).toEqual(blankett.identitet());
                expect(inneh�ll[2]).toEqual(blankett.slut());
        });

        it("Ska g� att l�gga till namn", function() {
                blankett.infogaNamn("Bj�rn Palmqvist");
                var inneh�ll = blankett.generera();

                expect(inneh�ll[2]).toEqual("#NAMN Bj�rn Palmqvist");
        });

        it("Ska g� att l�gga till en uppgift", function() {
                blankett.nyUppgift("4530", "169780001096");
                var inneh�ll = blankett.generera();

                expect(inneh�ll[2]).toEqual("#UPPGIFT 4530 169780001096");
        });

        it("Ska g� att l�gga till systeminfo", function() {
                blankett.l�ggtillSystemInfo("klarmarkerad 20130414 u a");
                var inneh�ll = blankett.generera();

                expect(inneh�ll[2]).toEqual("#SYSTEMINFO klarmarkerad 20130414 u a");
        });
});

describe("Filer ska hantera blanketterna", function() {
        var idOrgNr = "198105198256";

        var blankett1Id = "K10-2013";
        var blankett1 = new Blankett(blankett1Id, idOrgNr);
        
        var blankett2Id = "ANST-2013";
        var blankett2 = new Blankett(blankett2Id, idOrgNr);

        it("Ska g� att generera en fil med en blankett", function() {
                var fil = new Fil();
                fil.infogaBlankett(blankett1);

                var inneh�ll = fil.generera();
                expect(inneh�ll[0]).toEqual("#BLANKETT K10-2013");
                expect(inneh�ll[1]).toMatch(/#IDENTITET 198105198256 \d\d\d\d\d\d\d\d \d\d\d\d\d\d/);
                expect(inneh�ll[2]).toEqual("#BLANKETTSLUT");
                expect(inneh�ll[3]).toEqual("#FIL_SLUT");
        });

        it("Ska g� att generera en fil med flera blanketter", function() {
                var fil = new Fil();
                fil.infogaBlankett(blankett1);
                fil.infogaBlankett(blankett2);

                var inneh�ll = fil.generera();
                expect(inneh�ll[0]).toEqual("#BLANKETT K10-2013");
                expect(inneh�ll[1]).toMatch(/#IDENTITET 198105198256 \d\d\d\d\d\d\d\d \d\d\d\d\d\d/);
                expect(inneh�ll[2]).toEqual("#BLANKETTSLUT");
                expect(inneh�ll[3]).toEqual("#BLANKETT ANST-2013");
                expect(inneh�ll[4]).toMatch(/#IDENTITET 198105198256 \d\d\d\d\d\d\d\d \d\d\d\d\d\d/);
                expect(inneh�ll[5]).toEqual("#BLANKETTSLUT");
                expect(inneh�ll[6]).toEqual("#FIL_SLUT");
        });

        describe("BLAKETTER.SRU ska g� att generera", function() {
        
                it("Generera BLANKETTER.SRU", function() {
                        var fil = new Fil();
                        fil.infogaBlankett(blankett1);
                
                        var blanketterSru = genereraBlanketterSru(fil);

                        expect(blanketterSru).toMatch(/#BLANKETT K10-2013/);
                        expect(blanketterSru).toMatch(/#IDENTITET 198105198256 \d\d\d\d\d\d\d\d \d\d\d\d\d\d/);
                        expect(blanketterSru).toMatch(/#BLANKETTSLUT/);
                        expect(blanketterSru).toMatch(/#FIL_SLUT/);
                });
        });
});
