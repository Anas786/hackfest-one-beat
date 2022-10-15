export default class GeneralHelper {

    static generateMrNumber(): string {

        let mr = '';

        for( var i = 1; i <= 3; i++ ) {
            mr = mr + '' + Math.floor(Math.random() * (9 + 1))
        }

        mr = mr + '-'

        for( var i = 1; i <= 2; i++ ) {
            mr = mr + '' + Math.floor(Math.random() * (9 + 1))
        }

        mr = mr + '-'

        mr = mr + '' + Math.floor(Math.random() * (9 + 1))

        return mr
    }

}