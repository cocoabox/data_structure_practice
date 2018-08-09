/*
 * deep-clone a linked list ; each node contains a "random" pointer 
 * that may point to any member in the list, the node itself, or null(undefined)
 *
 * time complexity = O(2n) , n=count of nodes
 *
 * (alternate solution) = O(3n)
 * 
 * @see https://www.youtube.com/watch?v=xF9goDxk5nM
 *
 */
class NodeRandom {

    constructor(value, next, random) {
        this._value = value;
        this._next = next;
        this._random = random;
    }
    get value() { return this._value }
    get next() { return this._next }
    get random() { return this._random }
    set next(v) { this._next = v }
    set random(v) { this._random = v }

    toString() {
        let out = `${this._value}`
        if (this._next) out += `, next:${this._next.value}`;
        if (this._random) out += `, random:${this._random.value}`;
        return `[${out}]`
    }
}

function print_linked_list(head) {
    for (let node = head; node; node = node.next) {
        process.stdout.write(node.toString() + " ")    
    }
    process.stdout.write("\n")
}

// trivial solution
function clone_random_linked_list(head) {
    let cloned_value2object_hash = {},
        cloned_head = '', last = '';

    // create clones of each node 
    for (let node = head; node; node = node.next) {
        let cloned = new NodeRandom(node.value);
        if (! cloned_head) cloned_head = cloned;
        if (last) {
            last.next = cloned;
        }
        last = cloned;

        // a "value-to-clonedReference" map
        cloned_value2object_hash[cloned.value] = cloned;
    }

    // pass 2 : append each "random" pointers
    let cnode = cloned_head; 
    for (node = head; node ; node = node.next, cnode = cnode.next) {
        if (node.random) {
            let rand_value = node.random.value,
                cloned_ref = cloned_value2object_hash[rand_value];
            cnode.random = cloned_ref;
        }
    }

    return cloned_head;
}

function clone_random_linked_list_better(head) {
    //
    // step0:   node1 -> node2 -> node3 -> node4 -> node5
    //          v        v        v        v        v
    //          node3    node1    null     node5    node1
    // -----
    // step1:   node1 -> node1' -> node2 -> node2' -> node3 -> node3' -> node4 -> node4' -> node5 -> node5'
    //          v                  v                  v                  v                  v
    //          node3              node1              null               node5              node1
    // -----
    // step2:   node1 -> node1' -> node2 -> node2' -> node3 -> node3' -> node4 -> node4' -> node5 -> node5'
    //          v        v         v        v         v        v         v        v         v        v
    //          node3    node3     node1    node1     null     still     node5    node5     node1    node1
    //                   .next              .next                                 .next              .next
    // -----
    // step3:  separate the original nodes from cloned node (nodeN')

    // step 1:
    for (let node = head; node; node = node.next.next) {
        let node_prime = new NodeRandom(node.value, node.next)
        node.next = node_prime
    }

    // step 2:  
    for (let node = head; node; node = node.next.next) {
        let node_prime = node.next;
        node_prime.random = node && node.random ? node.random.next : undefined;
    }

    // step 3:
    let out = "";
    for (let node = head; node; node = node.next) {
        let node_prime = node.next,
            orig_next_node = node.next.next;
        if (! out) out = node_prime;
        node_prime.next = node.next.next;
        node.next = orig_next_node;
    }
    return out;
    
}

// main 
var node5 = new NodeRandom(5),
    node4 = new NodeRandom(4, node5),
    node3 = new NodeRandom(3, node4),
    node2 = new NodeRandom(2, node3),
    node1 = new NodeRandom(1, node2)

node1.random = node3
node2.random = node1
node3.random = null
node4.random = node5
node5.random = node1

//let cloned_head = clone_random_linked_list(node1)

let cloned_head = clone_random_linked_list_better(node1)
console.log("original :")
print_linked_list(node1)
console.log("cloned :")
print_linked_list(cloned_head)
