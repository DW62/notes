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

### 如何决定使用HashMap还是TreeMap

对于在Map中插入、删除、定位一个元素这类操作，HashMap是最好的选择，因为相对而言HashMap的插入会更快，但是如果对一个key集合进行有序遍历，那么TreeMap是更好的选择。

### 说一下HashMap的实现原理

HashMap基于Hash算法实现的，我们通过put(key，value)存储，get(key)来获取。当传入key时，hashMap会根据key.hashCode()计算出hash值，根据hash值将value保存在bucket里。当计算出hash值相同时，我们称之为hash冲突，hashMap的做法是用链表和红黑树存储相同hash值的value。当hash冲突的个数比较少时，使用链表否则使用红黑树。

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



