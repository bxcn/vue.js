function Node ( name ) {
  this.element = name;
  this.next    = null;
  this.prev    = null;
}
function LinkedList () {
  this.head         = new Node( 'head' );
  this.head.next    = this.head;
  this.find         = find;
  this.insert       = insert;
  this.findLast     = findLast;
  this.remove       = remove;
  this.display      = display;
  this.dispReverse  = dispReverse;
}
function find ( item ) {
  var currNode = this.head;
  while ( currNode.element != item ) {
    currNode = currNode.next;
  }
  return currNode;
}

function insert ( newElement, item ) {
  var newNode  = new Node( newElement );
  var current  = this.find( item );
  newNode.next = current.next;
  newNode.prev = current;
  current.next = newNode;
}
function findLast () {
  var currNode = this.head;
  while ( currNode.next != null  && currNode.next.element != 'head') {
    currNode = currNode.next;
  }
  return currNode;
}
function remove ( item ) {
  var currNode = this.find( item );
  if ( currNode.next != null ) {
    currNode.prev.next = currNode.next;
    currNode.next.prev = currNode.prev;
    currNode.next      = null;
    currNode.prev      = null;
    currNode           = null;
  }
}
function display () {
  var currNode = this.head;
  while ( currNode.next != null && currNode.next.element != 'head' ) {
    currNode = currNode.next;
    console.log( currNode.element )
  }
};
function dispReverse () {
  var currNode = this.head;
  currNode = this.findLast();
  while ( currNode.prev != null && currNode.element != 'head') {
  
    console.log( currNode.element )
    currNode = currNode.prev;
  }
};
var link = new LinkedList();
link.insert( 'first', 'head' );
link.insert( 'two', 'first' );
link.insert( 'three', 'two' );
link.insert( 'four', link.findLast().element );
link.insert( 'five', link.findLast().element );
link.display();
link.dispReverse();