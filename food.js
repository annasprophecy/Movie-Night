// Role #3 - Food Recommendations
// Movie Night Group Project

(function ($) {
    "use strict";

    const foodRecommendations = {
        action: [
            {
                name: "Loaded Nachos",
                description: "A bold, shareable snack that fits an action-heavy movie night.",
                pricePerPerson: 4.00,
                diets: ["vegetarian"],
                image: "images/food/nachos.jpg"
            },
            {
                name: "Popcorn",
                description: "A classic movie snack that is easy to share with a group.",
                pricePerPerson: 2.00,
                diets: ["vegetarian", "vegan", "gluten-free"],
                image: "images/food/popcorn.jpg"
            }
        ],

        adventure: [
            {
                name: "Trail Mix",
                description: "A portable snack that matches the adventurous theme.",
                pricePerPerson: 2.50,
                diets: ["vegetarian", "vegan", "gluten-free"],
                image: "images/food/trail-mix.jpg"
            },
            {
                name: "Pretzel Bites",
                description: "A fun shareable snack for a long adventure movie.",
                pricePerPerson: 3.00,
                diets: ["vegetarian"],
                image: "images/food/pretzel-bites.jpg"
            }
        ],

        comedy: [
            {
                name: "Popcorn",
                description: "A simple classic that works well for a relaxed comedy night.",
                pricePerPerson: 2.00,
                diets: ["vegetarian", "vegan", "gluten-free"],
                image: "images/food/popcorn.jpg"
            },
            {
                name: "Cookies",
                description: "A sweet and easy snack for a lighthearted movie night.",
                pricePerPerson: 2.50,
                diets: ["vegetarian"],
                image: "images/food/cookies.jpg"
            }
        ],

        romance: [
            {
                name: "Chocolate-Covered Strawberries",
                description: "A sweet pairing that fits a romantic movie night.",
                pricePerPerson: 4.00,
                diets: ["vegetarian", "gluten-free"],
                image: "images/food/chocolate-strawberries.jpg"
            },
            {
                name: "Mocktails",
                description: "A festive non-alcoholic drink option for couples or groups.",
                pricePerPerson: 3.50,
                diets: ["vegetarian", "vegan", "gluten-free"],
                image: "images/food/mocktails.jpg"
            }
        ],

        horror: [
            {
                name: "Popcorn",
                description: "A familiar snack that is easy to eat during a scary movie.",
                pricePerPerson: 2.00,
                diets: ["vegetarian", "vegan", "gluten-free"],
                image: "images/food/popcorn.jpg"
            },
            {
                name: "Gummy Candy",
                description: "A playful sweet snack that fits the spooky movie-night theme.",
                pricePerPerson: 2.50,
                diets: ["gluten-free"],
                image: "images/food/gummy-candy.jpg"
            }
        ],

        drama: [
            {
                name: "Cheese and Crackers",
                description: "A simple snack pairing that fits a slower, more relaxed movie night.",
                pricePerPerson: 4.00,
                diets: ["vegetarian"],
                image: "images/food/cheese-crackers.jpg"
            },
            {
                name: "Fruit Cups",
                description: "A lighter snack option that is easy to portion for a group.",
                pricePerPerson: 3.00,
                diets: ["vegetarian", "vegan", "gluten-free"],
                image: "images/food/fruit-cups.jpg"
            }
        ],

        documentary: [
            {
                name: "Fruit and Nut Mix",
                description: "A lighter snack for a more relaxed documentary viewing.",
                pricePerPerson: 3.00,
                diets: ["vegetarian", "vegan", "gluten-free"],
                image: "images/food/fruit-nut-mix.jpg"
            },
            {
                name: "Sparkling Water",
                description: "A simple drink option that pairs with almost any snack.",
                pricePerPerson: 1.50,
                diets: ["vegetarian", "vegan", "gluten-free"],
                image: "images/food/sparkling-water.jpg"
            }
        ]
    };

    function normalizeGenre(genre) {
        const value = String(genre || "").trim().toLowerCase();

        const aliases = {
            "rom-com": "romance",
            "romcom": "romance",
            "romantic comedy": "romance"
        };

        return aliases[value] || value;
    }

    function normalizeRestrictions(restrictions) {
        if (!restrictions) {
            return [];
        }

        if (Array.isArray(restrictions)) {
            return restrictions
                .map(function (item) {
                    return String(item).trim().toLowerCase();
                })
                .filter(Boolean);
        }

        return String(restrictions)
            .split(",")
            .map(function (item) {
                return item.trim().toLowerCase();
            })
            .filter(Boolean);
    }

    function matchesDiet(item, restrictions) {
        if (restrictions.length === 0) {
            return true;
        }

        return restrictions.every(function (restriction) {
            return item.diets.includes(restriction);
        });
    }

    function eventTypeScore(item, eventType) {
        const type = String(eventType || "").trim().toLowerCase();
        const name = item.name.toLowerCase();

        if (type === "family" && (name.includes("popcorn") || name.includes("fruit"))) {
            return 2;
        }

        if (type === "couple" && (name.includes("chocolate") || name.includes("mocktail"))) {
            return 2;
        }

        if (
            (type === "friends" || type === "group of friends") &&
            (name.includes("nachos") || name.includes("popcorn") || name.includes("pretzel"))
        ) {
            return 2;
        }

        return 0;
    }

    function getFoodRecommendation(options) {
        const settings = options || {};
        const genre = normalizeGenre(settings.genre);
        const people = Math.max(1, Number(settings.people) || 1);
        const budget = Number(settings.budget);
        const hasBudget = Number.isFinite(budget) && budget >= 0;
        const restrictions = normalizeRestrictions(settings.dietaryRestrictions);
        const eventType = settings.eventType || "";

        const genreOptions =
            foodRecommendations[genre] || foodRecommendations.comedy;

        const compatibleItems = genreOptions
            .filter(function (item) {
                return matchesDiet(item, restrictions);
            })
            .map(function (item) {
                return {
                    name: item.name,
                    description: item.description,
                    pricePerPerson: item.pricePerPerson,
                    estimatedCost: item.pricePerPerson * people,
                    image: item.image,
                    diets: item.diets,
                    score: eventTypeScore(item, eventType)
                };
            })
            .sort(function (a, b) {
                return b.score - a.score;
            });

        const selectedItems = [];
        let estimatedTotal = 0;

        compatibleItems.forEach(function (item) {
            if (selectedItems.length >= 2) {
                return;
            }

            const newTotal = estimatedTotal + item.estimatedCost;

            if (!hasBudget || newTotal <= budget) {
                selectedItems.push(item);
                estimatedTotal = newTotal;
            }
        });

        return {
            genre: genre,
            people: people,
            budget: hasBudget ? budget : null,
            dietaryRestrictions: restrictions,
            eventType: eventType,
            items: selectedItems,
            estimatedTotal: estimatedTotal
        };
    }

    function preloadFoodImages(items) {
        const preloadedImages = [];

        items.forEach(function (item) {
            const image = new Image();
            image.src = item.image;
            preloadedImages.push(image);
        });

        return preloadedImages;
    }

    function renderFoodRecommendation(result, containerSelector) {
        const selector = containerSelector || "#food-recommendations";
        const container = $(selector);

        if (container.length === 0) {
            return;
        }

        container.empty().hide();

        if (result.items.length === 0) {
            $("<p>")
                .addClass("food-message")
                .text(
                    "No food pairing matches the current budget and dietary restrictions."
                )
                .appendTo(container);

            container.fadeIn();
            return;
        }

        preloadFoodImages(result.items);

        result.items.forEach(function (item) {
            const card = $("<div>").addClass("food-card");

            $("<img>")
                .addClass("food-image")
                .attr("src", item.image)
                .attr("alt", item.name)
                .appendTo(card);

            $("<h3>")
                .addClass("food-name")
                .text(item.name)
                .appendTo(card);

            $("<p>")
                .addClass("food-description")
                .text(item.description)
                .appendTo(card);

            $("<p>")
                .addClass("food-cost")
                .text("Estimated cost: $" + item.estimatedCost.toFixed(2))
                .appendTo(card);

            card.appendTo(container);
        });

        $("<p>")
            .addClass("food-total")
            .text(
                "Estimated snack total: $" +
                    result.estimatedTotal.toFixed(2)
            )
            .appendTo(container);

        container.fadeIn();
    }

    window.MovieNightFood = {
        getFoodRecommendation: getFoodRecommendation,
        preloadFoodImages: preloadFoodImages,
        renderFoodRecommendation: renderFoodRecommendation
    };

})(jQuery);