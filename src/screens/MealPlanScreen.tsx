import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useMealPlanStore } from '../store/mealPlanStore';
import { useRecipesStore } from '../store/recipeStore';
import { MealSlot } from '../components/MealSlot';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

export function MealPlanScreen() {
  const navigation = useNavigation<any>();
  const { plans, activePlanId, isLoading, error, fetchPlans, getEntriesForDate, getDailyMacros } = useMealPlanStore();
  const { recipes, fetchRecipes } = useRecipesStore();

  useEffect(() => {
    fetchPlans();
    fetchRecipes();
  }, [fetchPlans, fetchRecipes]);

  useEffect(() => {
    if (plans.length > 0 && !activePlanId) {
      useMealPlanStore.getState().setActivePlan(plans[0].id);
    }
  }, [plans, activePlanId]);

  const datesOfPlan = useMemo(() => {
    const activePlan = plans.find(p => p.id === activePlanId);
    if (!activePlan) return [];
    
    const start = new Date(activePlan.startDate);
    const end = new Date(activePlan.endDate);
    const dates: string[] = [];
    
    let current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [plans, activePlanId]);

  const activePlan = plans.find(p => p.id === activePlanId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Errore: {error}</Text>
      </View>
    );
  }

  if (!activePlan) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Piano Pasti</Text>
        <Text style={styles.sub}>Nessun piano alimentare attivo o disponibile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>{activePlan.name}</Text>
      <Text style={styles.duration}>Dal {activePlan.startDate} al {activePlan.endDate}</Text>

      {datesOfPlan.map((date) => {
        const entries = getEntriesForDate(activePlanId!, date);
        const colazione = entries.find(e => e.slot === 'colazione');
        const pranzo = entries.find(e => e.slot === 'pranzo');
        const cena = entries.find(e => e.slot === 'cena');
        
        const dailyMacros = getDailyMacros(activePlanId!, date, recipes);

        return (
          <View key={date} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayText}>{date}</Text>
              <Text style={styles.dayCalories}>{Math.round(dailyMacros.calories)} kcal</Text>
            </View>
            
            <MealSlot 
              slotName="Colazione" 
              entry={colazione} 
              onAdd={() => navigation.navigate('AddMeal', { date, slot: 'colazione' })}
              onPress={() => colazione && navigation.navigate('RecipeDetail', { recipeId: colazione.recipeId })}
            />
            <MealSlot 
              slotName="Pranzo" 
              entry={pranzo} 
              onAdd={() => navigation.navigate('AddMeal', { date, slot: 'pranzo' })}
              onPress={() => pranzo && navigation.navigate('RecipeDetail', { recipeId: pranzo.recipeId })}
            />
            <MealSlot 
              slotName="Cena" 
              entry={cena} 
              onAdd={() => navigation.navigate('AddMeal', { date, slot: 'cena' })}
              onPress={() => cena && navigation.navigate('RecipeDetail', { recipeId: cena.recipeId })}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBE7', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FBE7' },
  title: { fontSize: 24, fontWeight: '700', color: '#1B5E20', marginBottom: 4 },
  duration: { fontSize: 14, color: '#757575', marginBottom: 16 },
  sub: { fontSize: 16, color: '#757575', marginTop: 8 },
  errorText: { color: '#C62828', fontSize: 16 },
  dayContainer: { marginBottom: 20 },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
    marginBottom: 8,
  },
  dayText: { fontSize: 16, fontWeight: '600', color: '#2E7D32' },
  dayCalories: { fontSize: 14, fontWeight: '600', color: '#FF9800' },});