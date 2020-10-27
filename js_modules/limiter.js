const me = module.exports = function(aLimit = 100){

    let limit = aLimit
    let count = 0

    this.increase = function(){
        let state = (count < limit)
        if (state) {
            count ++
        }
        return state
    }
    
    this.decrease = function(){
        count --
    }

} 
