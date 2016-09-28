A visualization of the K-means algorithm
----------------------------------------

Open [the demo](https://tylerhou.github.com/kmeans/dist/index.html) to begin
the visualization.

Click anywhere on the screen to add an open circle. Open circles represent
points on the two dimensional canvas. Shift-Click an existing point
to remove it.

To add five points at once, press space (these are randomly distributed).
For faster adding, press Shift+Space to add twenty-five.

Centroids are represented by closed circles. Each point in the group of
a centroid is the same color as the centroid itself, and there is a line
drawn between the point and the centroid.
To add or subtract from the number of  centroids, press + or - respectively.
Centroids are randomly chosen from the existing points, so adding and removing
them may result in a different structure. Kmeans does not always converge
to a global minimum, so in suboptimal configurations adding or removing
centroids may help. There may be up to ten centroids.
