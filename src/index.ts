import {app} from "./app";
import {runDb} from "./repositories/dbMongo-library";


const port = 5002
const startAPP = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startAPP()