class Node {
    constructor(id) {
        this.id = id;
        this.next = null;
    }

    setNext(node) {
        this.next = node;
    }

    getNext() {
        return this.next;
    }

    getId() {
        return this.id;
    }
}

class Queue {
    constructor() {
        this.front = null;
        this.tail = null;
        this.size = 0;
    }

    enqueue(id) {
        let node = new Node(id);
        
        if (this.size == 0) {
            this.front  = node;
            this.tail = node;
        } else {
            let curTail = this.tail;
            curTail.setNext(node);
            this.tail = node;
        }

        this.size++;
    }

    dequeue() {
        if (this.size == 0) {
            return -1;
        }

        let curFront = this.front;
        this.front = curFront.getNext();

        this.size--;

        return curFront.getId();
    }

    isEmpty() {
        if (this.size == 0) {
            return true;
        } else {
            return false;
        }
    }

    getSize() {
        return this.size;
    }

    print() {
        let current = this.front;
        // console.log("Print Queue");

        let queueString = "";

        if (current != null) {
            queueString = queueString + current.getId();
            current = current.getNext();
        }

        while (current != null) {
            queueString = queueString + "," + current.getId()
            // console.log(current.getId());
            current = current.getNext();
        }
        console.log(queueString);
    }
}

class ProbabilityQueue {
    constructor() {
        this.seen = new Queue();
        this.recognize = new Queue();
        this.retained = new Queue();
        this.proficent = new Queue();
        this.mastered = new Queue();

        this.maxLevel = 1;
        this.minLevel = 1;
    }

    updateLevels() {
        if (!this.seen.isEmpty()) {
            this.minLevel = 1;
        } else if (!this.recognize.isEmpty()) {
            this.minLevel = 2;
        } else if (!this.retained.isEmpty()) {
            this.minLevel = 3;
        } else if (!this.proficent.isEmpty()) {
            this.minLevel = 4;
        } else if (!this.mastered.isEmpty()) {
            this.minLevel = 5;
        }

        if (!this.mastered.isEmpty()) {
            this.maxLevel = 5;
        } else if (!this.proficent.isEmpty()) {
            this.maxLevel = 4;
        } else if (!this.retained.isEmpty()) {
            this.maxLevel = 3;
        } else if (!this.recognize.isEmpty()) {
            this.maxLevel = 2;
        } else if (!this.seen.isEmpty()) {
            this.maxLevel = 1;
        }


    }

    addSeen(id) {
        this.seen.enqueue(id);
        this.minLevel = 1;
    }

    addRecognize(id) {
        this.recognize.enqueue(id);
        this.updateLevels();
        // if (this.minLevel > 2) {
        //     this.minLevel = 2;
        // }

        // if (this.maxLevel == 1) {
        //     this.maxLevel = 2;
        // }
    }

    addRetained(id) {
        this.retained.enqueue(id);
        this.updateLevels();
        // if (this.minLevel > 3) {
        //     this.minLevel = 3;
        // }

        // if (this.maxLevel == 2) {
        //     this.maxLevel = 3;
        // }
    }

    addProficent(id) {
        this.proficent.enqueue(id);
        this.updateLevels();
        // if (this.minLevel > 4) {
        //     this.minLevel = 4;
        // }

        // if (this.maxLevel == 3) {
        //     this.maxLevel = 4;
        // }
    }

    addMastered(id) {
        this.mastered.enqueue(id);
        this.updateLevels();
        // if (this.minLevel > 5) {
        //     this.minLevel = 5;
        // }

        // if (this.maxLevel == 4) {
        //     this.maxLevel = 5;
        // }
    }
    
    getMastered() {
        if (this.mastered.isEmpty()) {
            this.updateLevels();
            return -1;
        } else {
            return this.mastered.dequeue();
        }
    }

    getProficent() {
        if (this.proficent.isEmpty()) {
            // this.minLevel = 5;
            this.updateLevels();
            return this.getMastered();
            
        } else {
            return this.proficent.dequeue();
        }
    }

    getRetained() {
        if (this.retained.isEmpty()) {
            // this.minLevel = 4;
            this.updateLevels();
            return this.getProficent();
            
        } else {
            return this.retained.dequeue();
        }
    }

    getRecognize() {
        if (this.recognize.isEmpty()) {
            // this.minLevel = 3;
            this.updateLevels();
            return this.getRetained();
            
        } else {
            return this.recognize.dequeue();
        }
    }

    getSeen() {
        // this.seen.print();
        // console.log(this.seen);
        if (this.seen.isEmpty()) {
            // this.minLevel = 2;
            this.updateLevels();
            return this.getRecognize();
            
        } else {
            return this.seen.dequeue();
        }
    }

    getMaxLevel() {
        return this.maxLevel;
    }

    getMinLevel() {
        return this.minLevel;
    }

    printQueues() {
        console.log("Seen:");
        this.seen.print();
        console.log("Recognize:");
        this.recognize.print();
        console.log("Retained:");
        this.retained.print();
        console.log("Proficent:");
        this.proficent.print();
        console.log("Mastered:");
        this.mastered.print();
    }
}

// class FavNode {
//     constructor(id) {
//         this.id = id;

//         this.prev = null;
//         this.next = null;
//     }

//     setNext (node) {
//         this.next = node;
//     }

//     setPrev (node) {
//         this.prev = node;
//     }
// }




// //Flashcard Editors Sturcutres
// class ElementNode {
//     constructor(id, question, answer) {
//         this.id = id;
//         this.question = question;
//         this.answer = answer;

//         this.next = null;
//     }

//     setNext (node) {
//         this.next = node;
//     }

//     debugPrinting() {
//         let printString = this.id + " | " + this.question.value + " : " + this.answer.value;
//         console.log(printString);
//     }
// }

// class ElementQueue {
//     constructor () {
//         this.front = null;
//         this.tail = null;
//         this.size = 0;
//     }

//     enqueue (id, question, answer) {
//         let newNode = new ElementNode(id, question, answer);

//         if (this.size == 0) {
//             this.front = newNode;
//         } else {
//             let prevTail = this.tail;
//             prevTail.setNext(newNode);
//         }

//         this.tail = newNode;
//         this.size++;
//     }

//     debugPrinting() {
//         let current = this.front;

//         while (current != null) {
//             current.debugPrinting();
//             current = current.next;
//         }
//     }
// }

// //Finished Flashcard Datastructures
// class FinishedFlashcard {
//     constructor (id, question, answer, q_img, a_img, star) {
//         this.id = id;
//         this.question = question;
//         this.answer = answer;
//         this.q_img = q_img;
//         this.a_img = a_img;
//         this.star = star;

//         this.prev = null;
//         this.next = null;
//     }

//     setPrev (node) {
//         this.prev = node;
//     }

//     setNext (node) {
//         this.next = node;
//     }
// }

// class FlashcardQueue {
//     constructor () {
//         this.front = null;
//         this.back = null;
//         this.size = 0;
//     }

//     enqueue (id, question, answer, q_img, a_img, star) {
//         let newNode = new FinishedFlashcard(id, question, answer, q_img, a_img, star);
//         if (this.size == 0) {
//             this.front = newNode;
//             this.back = newNode;
//         } else {
//             let backNode = this.back;
//             backNode.setNext(newNode);
//             newNode.setPrev(backNode);
//             this.back = newNode;
//         }

//         this.size++;

//     }
// }