function Node ( name ) {
  this.element = name;
  this.next    = null;
}
function LinkedList () {
  this.head         = new Node( 'head' );
  this.find         = find;
  this.findPrevious = findPrevious;
  this.insert       = insert;
  this.append       = append;
  this.remove       = remove;
  this.display      = display;
}
function find ( item ) {
  var currNode = this.head;
  while ( currNode.element != item ) {
    currNode = currNode.next;
  }
  return currNode;
}
function findPrevious ( item ) {
  var currNode = this.head;
  while ( currNode.next != null && currNode.next.element != item ) {
    currNode = currNode.next;
  }
  return currNode;
}
function insert ( newElement, item ) {
  var newNode  = new Node( newElement );
  var current  = this.find( item );
  newNode.next = current.next;
  current.next = newNode;
}
function append(item) {
  
  var newNode = new Node(item);
  var currNode = this.head;
  while( currNode.next != null ) {
    currNode = currNode.next;
  }
  currNode.next = newNode;
}
function remove ( item ) {
  var previousNode = this.findPrevious( item );
  if ( !(previousNode.next == null) ) {
    previousNode.next = previousNode.next.next;
  }
}
function display () {
  var currNode = this.head;
  while ( currNode.next != null ) {
    currNode = currNode.next;
    console.log( currNode.element )
  }
};
var link = new LinkedList();
link.insert( 'first', 'head' );
link.insert( 'two', 'first' );
//link.remove('first');
link.append('three');
link.append('four');
link.display();