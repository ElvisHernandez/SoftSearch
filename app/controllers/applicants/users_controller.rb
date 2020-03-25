class Applicants::UsersController < Applicants::UserBaseController
  before_action :is_current_user
  skip_before_action :verify_authenticity_token

  def index
      @user_favorites = UserFavorite.all
  end

  def create

    if(!%i[jobId user_id].all? { |s| params.has_key? s })
      return
    end

    job_id = params['jobId']
    user_id = params['user_id']
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!///////////////////#{job_id}"
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!///////////////////#{user_id}"

    UserFavorite.create(user_id: user_id, job_id: job_id)


  end

  def show
      @user_favorites = UserFavorite.find(params[:id])
    end
    
  def destroy
  @user_favorite = UserFavorite.find(params[:id])
  @user_favorite.destroy!
  redirect_to '/applicants/favorites', :notice => "Your favorite has been deleted"
  end
  
  private
  
  def job_params
      params.require(:user_favorite).permit(:user_id, :job_id)
  end
    
  def is_current_user
    user_url_id = params['user_id'].to_i
    unless current_user.id == user_url_id
        redirect_to root_path
    end
  end
end
