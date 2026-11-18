// Role #3 - Summary Page
// Movie Night Group Project

$(function () {
    "use strict";

    const summaryCard = $("#summary-card");
    const shareMessage = $("#share-message");

    // -----------------------------
    // Load saved movie night data
    // -----------------------------

    function getMovieNightPlan() {
        const savedPlan = localStorage.getItem("movieNightPlan");

        if (!savedPlan) {
            return null;
        }
        try {
            return JSON.parse(savedPlan);
        } catch (error) {
            console.error("Could not read movie night plan:", error);
            return null;
        }
    }


    // -----------------------------
    // Runtime helper
    // -----------------------------

    function formatRuntime(totalMinutes) {
        const minutes = Number(totalMinutes) || 0;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours + " hr " + remainingMinutes + " min";
    }

    // -----------------------------
    // Display event information
    // -----------------------------
    function displayEventDetails(plan) {
        const eventType = plan.eventType || "Not selected";
        const people = plan.people || 0;
        let restrictions = "None";

        if (
            Array.isArray(plan.dietaryRestrictions) &&
            plan.dietaryRestrictions.length > 0
        ) {
            restrictions = plan.dietaryRestrictions.join(", ");
        } else if (plan.dietaryRestrictions) {
            restrictions = plan.dietaryRestrictions;
        }

        $("#summary-event-type").text(eventType);
        $("#summary-people").text(people);
        $("#summary-diet").text(restrictions);
    }

    // -----------------------------
    // Display selected movies
    // -----------------------------
    function displayMovies(plan) {
        const movieContainer = $("#summary-movies");
        movieContainer.empty();

        if (
            !Array.isArray(plan.selectedMovies) ||
            plan.selectedMovies.length === 0
        ) {
            $("<p>")
                .text("No movies selected yet.")
                .appendTo(movieContainer);
            $("#summary-runtime").text("0 hr 0 min");
            return;
        }

        let totalRuntime = 0;
        plan.selectedMovies.forEach(function (movie) {
            const movieCard = $("<div>").addClass("summary-movie");
            $("<h3>")
                .text(movie.title || "Untitled Movie")
                .appendTo(movieCard);
            if (movie.genre) {
                $("<p>")
                    .text("Genre: " + movie.genre)
                    .appendTo(movieCard);
            }
            if (movie.runtime) {
                $("<p>")
                    .text("Runtime: " + formatRuntime(movie.runtime))
                    .appendTo(movieCard);
                totalRuntime += Number(movie.runtime);
            }
            movieCard.appendTo(movieContainer);
        });
        $("#summary-runtime").text(formatRuntime(totalRuntime));
    }

    // -----------------------------
    // Display planned breaks
    // -----------------------------
    function displayBreaks(plan) {
        const breaks = plan.plannedBreaks;
        if (!Array.isArray(breaks) || breaks.length === 0) {
            $("#summary-breaks").text("No breaks planned.");
            return;
        }
        $("#summary-breaks").empty();
        breaks.forEach(function (plannedBreak) {
            $("<p>")
                .text(plannedBreak)
                .appendTo("#summary-breaks");
        });
    }

    // -----------------------------
    // Display food recommendations
    // -----------------------------
    function displayFood(plan) {
        const foodContainer = $("#summary-food");
        foodContainer.empty();
        if (
            !plan.foodResult ||
            !Array.isArray(plan.foodResult.items) ||
            plan.foodResult.items.length === 0
        ) {
            $("<p>")
                .text("No snack recommendations yet.")
                .appendTo(foodContainer);
            $("#summary-budget").text("$0.00");
            return;
        }

        plan.foodResult.items.forEach(function (food) {
            const foodItem = $("<div>").addClass("summary-food-item");
            $("<h3>")
                .text(food.name)
                .appendTo(foodItem);

            if (food.description) {
                $("<p>")
                    .text(food.description)
                    .appendTo(foodItem);
            }

            if (food.estimatedCost !== undefined) {
                $("<p>")
                    .text(
                        "Estimated cost: $" +
                        Number(food.estimatedCost).toFixed(2)
                    )
                    .appendTo(foodItem);
            }
            foodItem.appendTo(foodContainer);
        });

        const total =
            Number(plan.foodResult.estimatedTotal) || 0;

        $("#summary-budget").text("$" + total.toFixed(2));
    }


    // -----------------------------
    // Render complete summary
    // -----------------------------

    function renderSummary(plan) {
        if (!plan) {
            $("#summary-card").hide();

            $("<p>")
                .addClass("summary-error")
                .text("No movie night plan was found.")
                .insertBefore(".summary-actions");

            return;
        }

        displayEventDetails(plan);
        displayMovies(plan);
        displayBreaks(plan);
        displayFood(plan);

        summaryCard.hide().fadeIn(600);
    }


    // -----------------------------
    // Build text for sharing
    // -----------------------------

    function buildShareText(plan) {
        let text = "MOVIE NIGHT PLAN\n\n";

        text += "Event Type: " +
            (plan.eventType || "Not selected") +
            "\n";

        text += "Number of People: " +
            (plan.people || 0) +
            "\n";

        if (
            Array.isArray(plan.dietaryRestrictions) &&
            plan.dietaryRestrictions.length > 0
        ) {
            text +=
                "Dietary Restrictions: " +
                plan.dietaryRestrictions.join(", ") +
                "\n";
        } else {
            text += "Dietary Restrictions: None\n";
        }


        text += "\nMovies:\n";

        let totalRuntime = 0;

        if (
            Array.isArray(plan.selectedMovies) &&
            plan.selectedMovies.length > 0
        ) {
            plan.selectedMovies.forEach(function (movie) {
                text += "- " + movie.title;

                if (movie.runtime) {
                    text +=
                        " (" +
                        formatRuntime(movie.runtime) +
                        ")";

                    totalRuntime += Number(movie.runtime);
                }

                text += "\n";
            });
        } else {
            text += "- No movies selected\n";
        }


        text +=
            "\nTotal Runtime: " +
            formatRuntime(totalRuntime) +
            "\n";


        text += "\nPlanned Breaks:\n";

        if (
            Array.isArray(plan.plannedBreaks) &&
            plan.plannedBreaks.length > 0
        ) {
            plan.plannedBreaks.forEach(function (plannedBreak) {
                text += "- " + plannedBreak + "\n";
            });
        } else {
            text += "- No breaks planned\n";
        }


        text += "\nSnack Suggestions:\n";

        if (
            plan.foodResult &&
            Array.isArray(plan.foodResult.items) &&
            plan.foodResult.items.length > 0
        ) {
            plan.foodResult.items.forEach(function (food) {
                text += "- " + food.name + "\n";
            });
        } else {
            text += "- No snacks selected\n";
        }


        const snackTotal =
            plan.foodResult &&
            plan.foodResult.estimatedTotal
                ? Number(plan.foodResult.estimatedTotal)
                : 0;

        text +=
            "\nEstimated Snack Budget: $" +
            snackTotal.toFixed(2);

        return text;
    }


    // -----------------------------
    // Load the saved plan
    // -----------------------------

    const movieNightPlan = getMovieNightPlan();

    renderSummary(movieNightPlan);


    // -----------------------------
    // Copy shareable summary
    // -----------------------------

    $("#share-summary").on("click", async function () {
        if (!movieNightPlan) {
            shareMessage
                .text("There is no summary to copy.")
                .hide()
                .fadeIn();

            return;
        }

        const summaryText =
            buildShareText(movieNightPlan);

        try {
            await navigator.clipboard.writeText(summaryText);

            shareMessage
                .text("Summary copied!")
                .hide()
                .fadeIn();

        } catch (error) {
            console.error("Could not copy summary:", error);

            shareMessage
                .text("Could not copy the summary.")
                .hide()
                .fadeIn();
        }
    });


    // -----------------------------
    // Return to movie selection
    // -----------------------------

    $("#back-to-movies").on("click", function () {
        window.location.href = "movies.html";
    });


    // -----------------------------
    // Restart movie night
    // -----------------------------

    $("#restart-plan").on("click", function () {
        localStorage.removeItem("movieNightPlan");

        window.location.href = "index.html";
    });
});