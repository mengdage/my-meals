// External dependencies
import React, { Component } from 'react';
import { FaCalendarPlusO, FaArrowRight } from 'react-icons/lib/fa/';
import ReactModal from 'react-modal';
import ReactLoading from 'react-loading';
import { connect } from 'react-redux';
// Custom dependencies
import FoodList from './FoodList';
import ShoppingList from './ShoppingList';
import { addRecipe, removeFromCalendar } from '../actions';
import { capitalize } from '../utils/helper';
import { fetchRecipes } from '../utils/api';


class App extends Component {
  constructor() {
    super();
    this.state = {
      foodModalOpen: false,
      loadingFood: false,
      meal: null,
      day: null,
      food: null,
      ingredientsModalOpen: false
    };

    this.openFoodModal = this.openFoodModal.bind(this);
    this.closeFoodModal = this.closeFoodModal.bind(this);
    this.searchFood = this.searchFood.bind(this);
    this.openIngredientsModal = this.openIngredientsModal.bind(this);
    this.closeIngredientsModal = this.closeIngredientsModal.bind(this);
  }

  // open modal
  openFoodModal( {meal, day} ) {
    this.setState({
      foodModalOpen: true,
      meal,
      day
    });
  }

  // close modal handler
  closeFoodModal() {
    this.setState({
      foodModalOpen: false,
      meal: null,
      day: null,
      food: null
    });
  }

  // open ingredients modal
  openIngredientsModal() {
    this.setState({
      ingredientsModalOpen: true
    });
  }

  // close ingredients modal
  closeIngredientsModal() {
    this.setState({
      ingredientsModalOpen: false
    });
  }

  // generate ingredient shopping list
  generateShoppingList() {
    return this.props.calendar.reduce( (meals,day) => {
      const { breakfast, lunch, dinner } = day.meals;

      // add meals (breakfast, lunch, dinner) to the meals array if not null
      breakfast && meals.push(breakfast);
      lunch && meals.push(lunch);
      dinner && meals.push(dinner);

      return meals;
    }, [])
      .reduce( (ingredients, meal) => {
        return ingredients.concat(meal.ingredientLines);
      }, []);
  }

  searchFood(e) {
    if(!this.input.value) {
      return;
    }

    e.preventDefault();
    this.setState({
      loadingFood: true
    });

    fetchRecipes(this.input.value)
      .then((food) => this.setState({
        food,
        loadingFood: false
      }));
  }

  render() {
    const { foodModalOpen, loadingFood, food, ingredientsModalOpen } = this.state;
    const { calendar, remove, selectRecipe } = this.props;
    const mealOrder = ['breakfast', 'lunch', 'dinner'];

    return (
      <div className='container'>
        <div className='nav'>
          <h1 className="header">Meals</h1>
          <button
            className="shopping-list"
            onClick={this.openIngredientsModal}
          >
            Shopping List
          </button>
        </div>
        <ul className='meal-types'>
          {mealOrder.map((mealType) => (
            <li key={mealType} className='subheader'>
              {capitalize(mealType)}
            </li>
          ))}
        </ul>

        <div className='calendar'>
          <div className='days'>
            {calendar.map(({day}) => (
              <h3 key={day} className='subheader'>
                {capitalize(day)}
              </h3>
            ))}
          </div>

          <div className='icon-grid'>
            {calendar.map(({day, meals}) => (
              <ul key={day}>
                {mealOrder.map((meal) => (
                  <li key={meal} className='meal'>
                    {meals[meal] ?
                      <div className='food-item'>
                        <img src={meals[meal].image} alt={meals[meal].label} />
                        <button onClick={()=>remove({day, meal})}>Clear</button>
                      </div> :
                      <button onClick={()=>this.openFoodModal({meal, day})} className='icon-btn'>
                        <FaCalendarPlusO size={30} />
                      </button>
                    }
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <ReactModal
          className='modal'
          overlayClassName='overlay'
          isOpen={foodModalOpen}
          onRequestClose={this.closeFoodModal}
          contentLabel="add recipe modal"
        >
          {
            loadingFood
              ? <ReactLoading color="#222" delay={200} type="spin" className="loading"/>
              : <div className="search-container">
                <h3 className="subheader">
                  Find a meal for {capitalize(this.state.day)} {this.state.meal}
                </h3>
                <div >
                  <form className="search" onSubmit={this.searchFood}>
                    <input
                      ref={(input) => this.input = input}
                      className="food-input"
                      type="text"
                      placeholder="search Foods"
                    />
                    <button
                      type="submit"
                      className="icon-btn"
                    >
                      <FaArrowRight size={30}/>
                    </button>

                  </form>
                </div>
                {food!=null && (
                  <FoodList
                    food={food}
                    onSelect={(recipe) => {
                      selectRecipe({recipe, day: this.state.day, meal: this.state.meal });
                      this.closeFoodModal();
                    }}
                  />
                )}
              </div>
          }

          <p><button onClick={this.closeFoodModal}>Close</button></p>
        </ReactModal>

        <ReactModal
          isOpen={ingredientsModalOpen}
          onRequestClose={this.closeIngredientsModal}
          className='modal'
          overlayClassName='overlay'
          contentLabel='ingredient modal'
        >
          {ingredientsModalOpen && <ShoppingList list={this.generateShoppingList()}/>}
        </ReactModal>
      </div>
    );
  }
}

function mapStateToProps({calendar, food}) {
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return {
    calendar: dayOrder.map(day => ({
      day,
      meals: Object.keys(calendar[day]).reduce((meals, meal)=> {
        meals[meal]=calendar[day][meal]?
          food[calendar[day][meal]] :
          null;
        return meals;
      }, {})

    }))
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectRecipe: (data) => dispatch(addRecipe(data)),
    remove: (data) => dispatch(removeFromCalendar(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
