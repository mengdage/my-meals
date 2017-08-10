// External dependencies
import React, { Component } from 'react';
import { FaCalendarPlusO, FaArrowRight } from 'react-icons/lib/fa/';
import ReactModal from 'react-modal';
import ReactLoading from 'react-loading';
import { connect } from 'react-redux';
// Custom dependencies
import FoodList from './FoodList'
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
      food: null
    };

    this.openFoodModal = this.openFoodModal.bind(this);
    this.closeFoodModal = this.closeFoodModal.bind(this);
    this.searchFood = this.searchFood.bind(this);
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
    const { foodModalOpen, loadingFood, food } = this.state;
    const { calendar, remove, selectRecipe } = this.props;
    const mealOrder = ['breakfast', 'lunch', 'dinner'];

    return (
      <div className='container'>
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
          contentLabel="Modal"
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
