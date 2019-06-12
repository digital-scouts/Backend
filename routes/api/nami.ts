import {Router} from "express";
import {NamiAPI} from "../../controller/namiController";
import {Stufe} from "../../controller/namiController";

class Nami {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.route('/')
            .get(async (request, response, next) => {
                let nami = new NamiAPI('203636', 'yx*&M%nD3pT$6C');
                nami.startSession().then((success) => {

                    nami.listMembers(Stufe.ALLE, null).then((data) => {
                        response.status(200).json(data)
                    });
                }, (error) => {
                    response.status(200).json("Nami Anmeldung fehlgeschlagen. Fehler: " + error)
                })
            });
    }
}


const namiRouter = new Nami();
namiRouter.init();

export default namiRouter.router;
