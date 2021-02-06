const SizeQuery = require("./SizeQuery");
const Utils = require("../Utils");

//**** THIS CLASS IS CURRENTLY NOT USED AND/OR NOT WORKING ****//

class SizeQueryList {
    constructor(videos, environment, progressBar) {
        this.videos = videos;
        this.environment = environment;
        this.progressBar = progressBar;
        this.limiterKey = Utils.getRandomID(16);
        this.done = 0
        this.length = videos.length;
    }

    async start() {
        return await new Promise(((resolve, reject) => {
            for(const video of this.videos) {
                let task = new SizeQuery(video, this.environment, this.progressBar);
                this.environment.limiterGroup.key(this.limiterKey).schedule(() => task.connect()).then((size) => {
                    if(this.done === this.length) {
                        this.environment.limiterGroup.deleteKey(this.limiterKey);
                        resolve();
                    }
                });
            }
        }));
    }
}

module.exports = SizeQueryList;
