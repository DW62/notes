### Java集合容器有哪些？

![image-20230307092548505](https://raw.githubusercontent.com/DW62/ImgStg/master/202303070925589.png)

> list 元素是有序的，可重复的；set元素是无序的，不可重复的。

### List、Set、Map之间的区别是什么？

List、Set、Map的主要区别体现在：元素是否有序、是否允许重复。

1. List集合中对象按照索引位置进行排序，可以有重复对象，允许按照对象在集合中的索引位置检索对象，例如通过list.git(i)方法来获取集合中的元素；
2. Map中每一个元素包含一个键和一个值，成对出现，键对象不可重复，值对象可以重复。
3. Set集合中的对象不按照特定的方法进行排序，并且没有重复对象，但它的实现类能对集合中的对象按照特定的方法排序，例如Tree Set类，可以按照默认顺序，也可以通过实现Java.util.Comparator< Type >接口来自定义排序方式。 

### HashMap和Hashtable有什么区别？

存储：HashMap允许一个key和多个不同的key对应的value为null，而hashtable不允许key或者value为空。

线程安全：Hashtable是线程安全的，而HashMap是非线程安全的。

推荐使用：在Hashtable的类注释可以看到，Hashtable是保留类不建议使用，推荐在单线程环境下使用HashMap替代，如果需要多线程使用则用ConcurrentHashMap

###  HashMap 和 TreeMap 的区别

HashMap 使用的是数组+链表，treeMap 是红黑树

### 如何决定使用HashMap还是TreeMap

对于在Map中插入、删除、定位一个元素这类操作，HashMap是最好的选择，因为相对而言HashMap的插入会更快，但是如果对一个key集合进行有序遍历，那么TreeMap是更好的选择。

### Hashmap中的key可以为任意对象或数据类型吗？

可以为null但不能是可变对象,如果是可变对象的话,对象中的属性改变,则对象 HashCode也进行相应的改变,导致下次无法查找到己存在Map中的效据
如果可变对象在 HashMap中被用作键,时就要小心在改变对象状态的时候,不要改变它的哈希值了。我们只需要保证成员变量的改变能保证该对象的哈希值不变即可.

### 说一下HashMap的实现原理

HashMap基于Hash算法实现的，我们通过put(key，value)存储，get(key)来获取。当传入key时，hashMap会根据key.hashCode()计算出hash值，根据hash值将value保存在bucket里。当计算出hash值相同时，我们称之为hash冲突，hashMap的做法是用链表和红黑树存储相同hash值的value。当hash冲突的个数比较少时，使用链表否则使用红黑树。

### JDK1.8 对HashMap的优化

> 类似的问题：
>
> HashMap如果有很多相同key，后面的链很长的话，你会怎么优化？或者你会用什么数据结构来存储？针对HashMap中某个Entry链太长，查找的时间复杂度可能达到O(n)，怎么优化？

在 JDK1.8 版本中，对数据结构做了进一步的优化，引入了红黑树。而当链表长度太长（默认超过 8）时，链表就转换为红黑树，利用红黑树快速增删改查的特点提高 HashMap 的性能，其中会用到红黑树的插入、删除、查找等算法。

JDK1.8 版本中对 hashMap 扩容不是重新计算所有元素在数组的位置，而使用的是 2 次幂的扩展(指长度扩为原来 2  倍)，所以，元素的位置要么是在原位置，要么是在原位置再移动 2 次幂的位置在扩充 HashMap 的时候，不需要像 JDK1.7 的实现那样重新计算 hash， 只需要看看原来的 hash 值新增的那个 bit 是 1 还是 0 就好了，是 0 的话索引没变，是 1 的话索引变成“原索引+oldCap”。

### 说一下HashSet实现原理

HashSet是基于HashMap实现的，HashSet底层使用HashMap来保存所有元素，因此HashSet的实现比较简单，相关HashSet的操作，基本上都是直接调用底层HashMap的相关方法来完成，HashSet不允许重复的值。

### ArrayList和LinkedList的区别是什么

数据解构实现：ArrayList是动态数组的数据结构实现，而Linked List是双链表的数据结构实现。

数据访问效率：Array List比LinkedList在随机访问时效率高，因为linkedList是线性的数据存储，所以需要移动指针从前向后以此查找。

增加和删除效率：在非首尾的增加和删除操作，LinkedList要比ArrayList效率高，因为ArrayList增删操作要影响数组内其他数据的下标。

综合来说：在需要频繁读取集合元素时，更推荐使用ArrayList，而在频繁插入和删除更推荐LinkedList。

### 如何实现数组和LIst之间的转换

数组转List：使用Arrays.asList(array)进行转换

List转数组：使用List自带的toArray()方法

### ArrayList和Vector的区别是什么？

线程安全：Vector使用Synchronized来实现线程同步，是线程安全的，而ArrayList是非线程安全的。

性能：ArrayList在性能方面要优于Vector

扩容：ArrayList和Vector都会根据实际的需要动态调整容量，只不过在Vector扩容每次只会增加1倍而ArrayList只会增加50%

### Array和ArrayList有何区别？

Array可以存储基本数据类型和对象，ArrayList只能存储对象

Array是指定固定大小的，而ArrayList大小是自动扩展的。

Array内置方法没有ArrayList多，比如addAll、removerAll、iteration等方法只有ArrayList有

### Collection和Collections有什么区别？

Collection是一个集合接口，它提供了对集合对象进行基本操作的通用接口方法，所有集合都是它的子类，比如List、set等

Collections是一个包装类，它提供了很多静态方法，不能被实例化就像一个工具类，比如提供的排序方法：Collections.sort(list)。

### 在Queue中poll()和remove()有什么区别？

相同点：都是返回第一个元素，并在队列中删除返回对象/

不同点：如果没有元素poll()会返回null，而remove()会直接抛出NoSuchElementException异常

### 哪些集合是线程安全的

Vector、Hashtable、Stack都是线程安全的，而像HashMap则是非线程安全的，不过JDK1.5之后随着java.utill.concurrent并发包的出现，他们也有了自己对应的线程安全类，比如HashMap对应的线程安全类就是ConcurrentHashMap。

### ConcurrentHashMap和HashTable区别

- ConcurrentHashMap仅仅锁定map的某个部分，而Hashtable则会锁定整个map。
- hashtable(同一把锁):使用synchronized来保证线程安全，但效率非常低下。当一个线程访问同步方法时，其他线程也访问同步方法，可能会进入阻塞或轮询状态，如使用put添加元素，另一个线程不能使用put添加元素，也不能使用get，竞争会越来越激烈效率越低。
- concurrenthashmap(分段锁):(锁分段技术)每一把锁只锁容器其中一部分数据，多线程访问容器里不同数据段的数据，就不会存在锁竞争，提高并发访问率。首先将数据分为一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据时，其他段的数据也能被其他线程访问。
- concurrenthashmap是由Segment数组结构和HahEntry数组结构组成。Segment是一种可重入锁ReentrantLock，扮演锁的角色。HashEntry用于存储键值对数据。一个concurrenthashmap里包含一个Segment数组。Segment的结构和Hashmap类似，是一种数组和链表结构，一个Segment包含一个HashEntry数组，每个HashEntry是一个链表结构的元素，每个Segment守护着一个HashEntry数组里的元素，当对HashEntry数组的数据进行修改时，必须首先获得对应的Segment。

###  Hashmap 为什么线程不安全

> hash碰撞和扩容导致,HashMap扩容的的时候可能会形成环形链表，造成死循环。

- HashMap 底层是一个Entry 数组，当发生 hash 冲突的时候，hashMap 是采用链表的方式来解决的，在对应的数组位置存放链表的头结点。对链表而言，新加入的节点会从头结点加入。假如 A 线程和B 线程同时对同一个数组位置调用 addEntry，两个线程会同时得到现在的头结点，然后 A 写入新的头结点之后，B 也写入新的头结点，那 B 的写入操作就会覆盖A 的写入操作造成A 的写入操作丢失
- 删除键值对的代码如上：当多个线程同时操作同一个数组位置的时候，也都会先取得现在状态下该位置存储的头结点，然后各自去进行计算操作，之后再把结果写回到该数组位置去， 其实写回的时候可能其他的线程已经就把这个位置给修改过了，就会覆盖其他线程的修改
- 当多个线程同时检测到总数量超过门限值的时候就会同时调用 resize 操作，各自生成新的数组并 rehash 后赋给该map 底层的数组 table，结果最终只有最后一个线程生成的新数组被赋给 table 变量，其他线程的均会丢失。而且当某些线程已经完成赋值而其他线程刚开始的时候，就会用已经被赋值的 table 作为原始数组，这样也会有问题。

### HashMap 高并发情况下会出现什么问题？ 

扩容问题

### 迭代器Iterator是什么？

Iterator接口提供遍历任何Collention的接口。我们可以从一个Collection中使用迭代器的方法来获取迭代器实例。迭代器取代了Java集合框架中的Enumeration，迭代器允许调用者在迭代过程中移除元素。

### Iterator怎么使用？有什么特点？

**使用：**

```java
List list = new ArrayList<>();
Iterator it =list.iterator();
while(it.hasNext()){
    String obj=it.next();
    System.out.println(obj);
}
```

Iterator的特点是更加安全，因为它可以保证，在当前遍历的集合元素被改变的时候，就会抛出ConcurrentModificationException异常。

### Iterator和ListIterator有什么区别？

Iterator可以遍历Set和List，而ListIterator只能遍历List

Iterator只能单向遍历，而ListIterator可以双向遍历(向前/向后)

ListIterator从Iterator接口继承，然后添加了一些额外的功能，比如添加一个元素，替换一个元素、获取前面或者后面元素的索引位置。

### 怎么确保一个集合不能被修改？

可以使用Collections.unmodifiableCollection(Collection c) 方法来创建一个只读的集合，这样改变集合的任何操作对会抛出Java.lang.UnsupportedOperationException异常

```java
//示例代码如下；
List list=new ArrayList<>();
list.add("X");
Collection clist=Collections.unmodifableCollection(list);
clist.add("y");//允许时报错
System.out.println(l)
```



