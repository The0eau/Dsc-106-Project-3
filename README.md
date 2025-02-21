---

# Dynamic Visualization: How do meals affect blood glucose level?

---

<p align="center">
Justin Seo,
</p>

<p align="center">
Theau Aguet,
</p>

<p align="center">
Selina Wu
</p>


---
The management of blood glucose levels is critical for understanding metabolic health, particularly for detecting glycemic variability, spikes, and hypoglycemic events. Such insights are essential for healthcare providers looking to optimize dietary recommendations, patients aiming for better glucose control, and researchers studying metabolic patterns. Our project aims to explore how meal composition impacts blood glucose fluctuations throughout the day. This can help in managing conditions like diabetes, tailoring personalized nutrition plans, and identifying risk factors for metabolic disorders. Our main question is: How do meals impact blood glucose levels? Some key questions our visualization aims to help answer include: how do high-carb meals affect glucose levels throughout the day, are there noticeable differences in glucose response after meals high in protein vs sugar, and how quickly does glucose return to baseline after specific meal compositions?
 Using the BIG IDEAs Lab Glycemic Variability and Wearable Device Data, we developed an interactive web-based visualization that enables users to dynamically explore the relationship between nutritional intake (calories, protein, carbohydrates, and sugar) and blood glucose levels. 
	For the purposes of this visualization, we focused on February 14, 2020, for a single participant, to provide a more detailed and interpretable view of daily glycemic responses to meal consumption. By isolating one day of data, the visualization eliminates confounding trends and allows for a more precise examination of postprandial glucose responses, highlighting how different nutritional components impact glucose levels over time.
	Our interactive visualization consists of a side menu that allows users to select and overlay multiple graphs, as well as a tooltip that allows users to view exact time and glucose levels for each hour on the raw glucose graph. Graphs can be overlaid to help observe correlations between food intake and glucose levels. For example, overlaying carb intake and smoothed glucose levels reveals how high carb meals may contribute to rapid glucose spikes. The graphs share a common x-axis (time of day 00:00 - 24:00), providing a synchronized view of how nutritional factors influence glucose levels throughout the day. Users can select from the following graphs: smoothed glucose (mg/dL), raw glucose (mg/dL), calories (Kcal), protein (g), carbohydrates (g), sugar (g). In addition, users can choose whether the y-axis labels are displayed on the left or right side of the graph by clicking the corresponding boxes, allowing for better visibility and organization.
	For the graphs that we selected, raw glucose displays unfiltered glucose data for a detailed examination of rapid fluctuations, while smoothed glucose highlights general glucose trends by reducing noise from continuous monitoring data. The smoothed option allows users to observe overall trends without the distraction of rapid, minor fluctuations. On the other hand, the raw glucose option helps identify immediate spikes following meals, providing a more granular perspective, and includes the tooltip to view specific data. The calories, protein, carbohydrates, and sugar charts show nutritional intake patterns throughout the day. A synchronized x-axis ensures that users can easily correlate meal timing with corresponding glucose changes, allowing for intuitive comparisons across variables. 
	To create the smoothed glucose data, we applied an exponential smoothing function to the raw glucose data to create the smoothed graph, providing a clearer picture of overall trends while minimizing short term noise. We also used February 14th 2020 because it was the first full day of data that we are given. We used a distinct color palette, giving each graph a unique high-contrast color for easy differentiation. 
	The story behind our project revolves around a single day: February 14, 2020. We chose this date to focus on one participant’s data, ensuring a more detailed and interpretable view of daily glycemic responses to meal consumption. This narrative helps eliminate confounding trends, offering a clear examination of postprandial glucose responses and how different nutritional components like protein, carbs, and sugar affect glucose levels over time.
	To work together as a team, we first developed some graphs individually to explore the data and develop our ideas, then we met in person to brainstorm and talk about ideas for our final visualization, and then we later met up again to work on our final together. We learned that maintaining visual clarity while displaying multiple data streams required thoughtful color and layout decisions. For the split, Theau did the dataset selection, interactive chart implementation, and filtering and dynamic updates. Justin did the dataset selection and annotations and meal markers and styling and UI enhancements. Selina did debugging and optimization, and the write-up and documentation. 

---
Task | Team Member | Time


* Dataset Selection & Cleaning
Theau 1h




* Interactive Chart Implementation (D3.js)
Theau 3 h




* Filtering & Dynamic Updates
Theau 2 h




* Annotations & Meal Markers
Justin     1.5h




* Styling & UI Enhancements (CSS)
Justin        2h




* Debugging & Optimization
Selina
2h


* Write-Up & Documentation
Selina
1.5h




