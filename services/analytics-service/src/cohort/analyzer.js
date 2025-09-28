export class CohortAnalyzer {
  constructor(pool) {
    this.pool = pool;
  }

  async analyzeCohorts(clientId, timeframe = '12_months') {
    const cohortData = await this.generateCohortData(clientId, timeframe);
    
    const analysis = {
      client_id: clientId,
      timeframe,
      cohorts: cohortData,
      ltv_analysis: await this.calculateLTV(cohortData),
      cac_analysis: await this.calculateCAC(clientId, timeframe),
      retention_analysis: this.calculateRetention(cohortData),
      business_metrics: this.calculateBusinessMetrics(cohortData),
      recommendations: [],
      analyzed_at: new Date().toISOString()
    };

    // Générer des recommandations basées sur l'analyse
    analysis.recommendations = this.generateCohortRecommendations(analysis);
    
    return analysis;
  }

  async generateCohortData(clientId, timeframe) {
    const cohorts = [];
    const monthsCount = timeframe === '12_months' ? 12 : 6;
    
    for (let i = 0; i < monthsCount; i++) {
      const cohortMonth = new Date();
      cohortMonth.setMonth(cohortMonth.getMonth() - i);
      
      const initialUsers = Math.floor(Math.random() * 1000) + 100;
      const cohort = {
        cohort_month: cohortMonth.toISOString().slice(0, 7),
        initial_users: initialUsers,
        retention_by_month: {},
        revenue_by_month: {},
        cumulative_revenue: 0
      };

      // Calculer la rétention mois par mois
      let remainingUsers = initialUsers;
      for (let month = 0; month <= i; month++) {
        const retentionRate = month === 0 ? 100 : 
          Math.max(10, remainingUsers * (0.7 + Math.random() * 0.2)) / remainingUsers * 100;
        
        remainingUsers = Math.floor(remainingUsers * (retentionRate / 100));
        cohort.retention_by_month[`month_${month}`] = {
          users: remainingUsers,
          retention_rate: retentionRate.toFixed(1)
        };

        // Calculer le revenue par mois
        const avgRevenue = 25 + Math.random() * 50; // 25-75€ par utilisateur
        const monthlyRevenue = remainingUsers * avgRevenue;
        cohort.revenue_by_month[`month_${month}`] = monthlyRevenue;
        cohort.cumulative_revenue += monthlyRevenue;
      }

      cohorts.push(cohort);
    }

    return cohorts;
  }

  async calculateLTV(cohortData) {
    const ltvByMonth = {};
    let totalLTV = 0;
    let avgLTV = 0;

    cohortData.forEach(cohort => {
      const cohortLTV = cohort.cumulative_revenue / cohort.initial_users;
      ltvByMonth[cohort.cohort_month] = {
        ltv: cohortLTV.toFixed(2),
        total_revenue: cohort.cumulative_revenue,
        total_users: cohort.initial_users
      };
      totalLTV += cohortLTV;
    });

    avgLTV = totalLTV / cohortData.length;

    // Prédiction LTV à 12 mois
    const predictedLTV12Months = avgLTV * 1.3; // Estimation basée sur tendance

    return {
      average_ltv: avgLTV.toFixed(2),
      predicted_ltv_12_months: predictedLTV12Months.toFixed(2),
      ltv_by_cohort: ltvByMonth,
      ltv_trend: this.calculateLTVTrend(ltvByMonth),
      currency: 'EUR'
    };
  }

  async calculateCAC(clientId, timeframe) {
    // Simulation des coûts d'acquisition
    const months = timeframe === '12_months' ? 12 : 6;
    const cacByMonth = {};
    let totalSpent = 0;
    let totalAcquired = 0;

    for (let i = 0; i < months; i++) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthKey = month.toISOString().slice(0, 7);

      const marketingSpend = Math.floor(Math.random() * 5000) + 2000; // 2k-7k€
      const usersAcquired = Math.floor(Math.random() * 200) + 50; // 50-250 users
      const cac = marketingSpend / usersAcquired;

      cacByMonth[monthKey] = {
        marketing_spend: marketingSpend,
        users_acquired: usersAcquired,
        cac: cac.toFixed(2)
      };

      totalSpent += marketingSpend;
      totalAcquired += usersAcquired;
    }

    const avgCAC = totalSpent / totalAcquired;

    return {
      average_cac: avgCAC.toFixed(2),
      total_marketing_spend: totalSpent,
      total_users_acquired: totalAcquired,
      cac_by_month: cacByMonth,
      cac_trend: this.calculateCACTrend(cacByMonth),
      currency: 'EUR'
    };
  }

  calculateRetention(cohortData) {
    const retentionRates = {
      month_1: [],
      month_3: [],
      month_6: [],
      month_12: []
    };

    cohortData.forEach(cohort => {
      if (cohort.retention_by_month.month_1) {
        retentionRates.month_1.push(parseFloat(cohort.retention_by_month.month_1.retention_rate));
      }
      if (cohort.retention_by_month.month_3) {
        retentionRates.month_3.push(parseFloat(cohort.retention_by_month.month_3.retention_rate));
      }
      if (cohort.retention_by_month.month_6) {
        retentionRates.month_6.push(parseFloat(cohort.retention_by_month.month_6.retention_rate));
      }
      if (cohort.retention_by_month.month_12) {
        retentionRates.month_12.push(parseFloat(cohort.retention_by_month.month_12.retention_rate));
      }
    });

    return {
      avg_retention_month_1: this.average(retentionRates.month_1).toFixed(1) + '%',
      avg_retention_month_3: this.average(retentionRates.month_3).toFixed(1) + '%',
      avg_retention_month_6: this.average(retentionRates.month_6).toFixed(1) + '%',
      avg_retention_month_12: this.average(retentionRates.month_12).toFixed(1) + '%',
      retention_curve: retentionRates
    };
  }

  calculateBusinessMetrics(cohortData) {
    const totalRevenue = cohortData.reduce((sum, cohort) => sum + cohort.cumulative_revenue, 0);
    const totalUsers = cohortData.reduce((sum, cohort) => sum + cohort.initial_users, 0);
    
    return {
      total_revenue: totalRevenue.toFixed(2),
      total_users: totalUsers,
      average_revenue_per_user: (totalRevenue / totalUsers).toFixed(2),
      revenue_growth_rate: this.calculateRevenueGrowth(cohortData),
      user_growth_rate: this.calculateUserGrowth(cohortData)
    };
  }

  generateCohortRecommendations(analysis) {
    const recommendations = [];
    const ltvCacRatio = parseFloat(analysis.ltv_analysis.average_ltv) / parseFloat(analysis.cac_analysis.average_cac);

    // Recommandations LTV/CAC
    if (ltvCacRatio < 3) {
      recommendations.push({
        priority: 'HIGH',
        type: 'LTV_CAC_OPTIMIZATION',
        metric: `LTV/CAC Ratio: ${ltvCacRatio.toFixed(2)}`,
        action: 'Improve LTV/CAC ratio - Currently below healthy threshold of 3:1',
        suggestions: [
          'Optimize marketing spend efficiency',
          'Increase customer lifetime value',
          'Improve retention strategies',
          'Focus on higher-value customer segments'
        ]
      });
    }

    // Recommandations rétention
    const retention1Month = parseFloat(analysis.retention_analysis.avg_retention_month_1);
    if (retention1Month < 50) {
      recommendations.push({
        priority: 'HIGH',
        type: 'RETENTION_IMPROVEMENT',
        metric: `Month 1 Retention: ${retention1Month}%`,
        action: 'Critical: Low first-month retention',
        suggestions: [
          'Improve onboarding experience',
          'Implement early engagement campaigns',
          'Optimize product-market fit',
          'Add customer success touchpoints'
        ]
      });
    }

    return recommendations;
  }

  // Méthodes utilitaires
  average(arr) {
    return arr.length > 0 ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
  }

  calculateLTVTrend(ltvByMonth) {
    const values = Object.values(ltvByMonth).map(item => parseFloat(item.ltv));
    return values.length > 1 ? 
      (values[0] - values[values.length - 1]) / values[values.length - 1] * 100 : 0;
  }

  calculateCACTrend(cacByMonth) {
    const values = Object.values(cacByMonth).map(item => parseFloat(item.cac));
    return values.length > 1 ? 
      (values[0] - values[values.length - 1]) / values[values.length - 1] * 100 : 0;
  }

  calculateRevenueGrowth(cohortData) {
    if (cohortData.length < 2) return 0;
    const latest = cohortData[0].cumulative_revenue;
    const previous = cohortData[1].cumulative_revenue;
    return ((latest - previous) / previous * 100).toFixed(1) + '%';
  }

  calculateUserGrowth(cohortData) {
    if (cohortData.length < 2) return 0;
    const latest = cohortData[0].initial_users;
    const previous = cohortData[1].initial_users;
    return ((latest - previous) / previous * 100).toFixed(1) + '%';
  }
}
