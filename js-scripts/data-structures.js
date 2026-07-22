/**
 * Node class
 * 
 * Creates a node for a linked list
 */
class Node {
    //need value of node (id) to create new node
    //next node defaults to null
    constructor(id) {
        this.id = id;
        this.next = null;
    }

    //update next node
    setNext(node) {
        this.next = node;
    }

    //get the next node
    getNext() {
        return this.next;
    }

    //get id of the node
    getId() {
        return this.id;
    }
}

/**
 * Queue class
 * 
 * Use the Node class to create a queue
 */
class Queue {
    //creates empty node
    constructor() {
        this.front = null;  //front of queue (first to be pulled out)
        this.tail = null;   //end of queue (where new nodes are added)
        this.size = 0;      //number of elements in queue
    }

    //adds new value into the queue
    enqueue(id) {
        //create new node
        let node = new Node(id);
        
        //check if queue is empty
        if (this.size == 0) {
            //add item to front (empty queue)
            this.front  = node;
            this.tail = node;
        } else {
            //add item to end of queue
            let curTail = this.tail;
            curTail.setNext(node);
            this.tail = node;
        }

        //increase size of queue
        this.size++;
    }

    //remove and returns value at node at beginning of queue
    dequeue() {
        //check if queue is empty
        if (this.size == 0) {
            return -1;
        }

        //remove node from front
        let curFront = this.front;
        this.front = curFront.getNext();

        //decrease size of queue
        this.size--;

        //return value of front node
        return curFront.getId();
    }

    //check if queue is empty
    isEmpty() {
        if (this.size == 0) {
            return true;
        } else {
            return false;
        }
    }

    //return size of queue
    getSize() {
        return this.size;
    }

    //print the queue to console (debugging)
    print() {
        //create pointer in queue
        let current = this.front;

        let queueString = "";

        //get first item in queue
        if (current != null) {
            queueString = queueString + current.getId();
            current = current.getNext();
        }

        //iterate through queue
        while (current != null) {
            //add id to queuestring
            queueString = queueString + "," + current.getId();

            //move to next item in queue
            current = current.getNext();
        }

        //print queue info in console
        console.log(queueString);
    }
}

/**
 * 5 Queues storing card_ids based on the progress of
 * the card_id
 */
class ProbabilityQueue {
    //create 5 queues and set min/max level to 1
    constructor() {
        this.seen = new Queue();
        this.recognize = new Queue();
        this.retained = new Queue();
        this.proficent = new Queue();
        this.mastered = new Queue();

        this.maxLevel = 1;
        this.minLevel = 1;
    }

    //update min and max levels based on emptiness of queues
    updateLevels() {
        //check for 'lowest' non-empty queue to set min level
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

        //check for 'highest' non-empty queue to set max level
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

    //add id to seen queue and set minlevel to 1
    addSeen(id) {
        this.seen.enqueue(id);
        this.minLevel = 1;
    }

    //add id to recognize queue and update min/max level
    addRecognize(id) {
        this.recognize.enqueue(id);
        this.updateLevels();
    }

    //add id to retained queue and update min/max level
    addRetained(id) {
        this.retained.enqueue(id);
        this.updateLevels();
    }

    //add id to proficent queue and update min/max level
    addProficent(id) {
        this.proficent.enqueue(id);
        this.updateLevels();
    }

    //add id to mastered queue and update min/max level
    addMastered(id) {
        this.mastered.enqueue(id);
        this.updateLevels();
    }
    
    //get first element from mastered queue and update max/min levels
    //if mastered is empty, return -1
    getMastered() {
        if (this.mastered.isEmpty()) {
            return -1;
        } else {
            return this.mastered.dequeue();
        }

        this.updateLevels();
    }

    //get first element from proficient queue and update max/min levels
    //if queue is empty, check the mastered queue
    getProficent() {
        if (this.proficent.isEmpty()) {
            return this.getMastered();
            
        } else {
            return this.proficent.dequeue();
        }

        this.updateLevels();
    }

    //get first element from retained queue and update max/min levels
    //if queue is empty, check the proficent queue
    getRetained() {
        if (this.retained.isEmpty()) {
            return this.getProficent();
            
        } else {
            return this.retained.dequeue();
        }

        this.updateLevels();
    }

    //get first element from recognize queue and update max/min levels
    //if queue is empty, check the retained queue
    getRecognize() {
        if (this.recognize.isEmpty()) {
            return this.getRetained();
            
        } else {
            return this.recognize.dequeue();
        }

        this.updateLevels();
    }

    //get first element from seen queue and update max/min levels
    //if queue is empty, check the recognize queue
    getSeen() {
        if (this.seen.isEmpty()) {
            return this.getRecognize();
            
        } else {
            return this.seen.dequeue();
        }

        this.updateLevels();
    }

    //get max level
    getMaxLevel() {
        return this.maxLevel;
    }

    //get min level
    getMinLevel() {
        return this.minLevel;
    }

    //print info of all queues
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